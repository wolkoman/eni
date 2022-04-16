import {CalendarCacheNotice} from './CalendarCacheNotice';
import {CalendarErrorNotice} from './CalendarErrorNotice';
import {useEffect, useState} from 'react';
import {CalendarEvent} from '../../util/calendar-events';
import {useCalendarStore} from '../../util/use-calendar-store';
import {useUserStore} from '../../util/use-user-store';
import {Section} from '../Section';
import {Event, EventDateText} from './Event';
import Responsive from '../Responsive';

export function ComingUp({}) {
    const calendar = useCalendarStore(state => state);
    const [groups, setGroups] = useState<Record<string, Record<string, CalendarEvent[]>>>({});
    const [jwt] = useUserStore(state => [state.jwt]);
    const now = new Date().getTime();
    const tomorrow = now + 3600 * 1000 * 24 * 7;

    function summaryToGroup(summary: string): string[] {
        let conditions: ((x: string) => string | false)[] = [
            x => x.startsWith("taufe") && "Taufe",
            x => x.startsWith("grabwache") && "Grabwache",
            x => x.includes("messe") && "Messe",
            x => x.includes("jungschar") && "Jungschar",
            x => x.includes("evangel") && "Ökumene",
            x => x.startsWith("emmausgebet") && "Gebet & Bibel",
            x => x.startsWith("gebetsrunde") && "Gebet & Bibel",
            x => x.startsWith("sprechstunde mit jesus") && "Gebet & Bibel",
            x => x.includes("eltern-kind-treff") && "Kinder",
            x => x.startsWith("kinderstunde") && "Kinder",
            x => x.startsWith("bibel aktiv") && "Gebet & Bibel",
            x => x.startsWith("vesper") && "Gottesdienst",
            x => x.includes("taufe") && "_",
            x => x.includes("generalprobe") && "_",
            x => x.includes("pgr sitzung") && "Gremien",
            x => x.includes("caritas-sprechstunde") && "Gremien",
        ];
        let groups = conditions.reduce<(string|false)[]>((groups, condition) => [
            ...groups,
            condition(summary.toLowerCase())
        ], [])
            .filter((group): group is string => !!group);

        return groups.length === 0 ? [summary] : groups.filter(group => group !== "_");
    }

    useEffect(() => calendar.load(jwt), [jwt]);
    useEffect(() => {
        const events = Object.entries(calendar.items)
            .filter(([date]) => new Date(date) < new Date(tomorrow))
            .flatMap(([date, events]) => events
                .map(event => ({...event, date}))
            ).filter(event => event.visibility !== 'private');
        const groups = events.reduce<Record<string, Record<string, CalendarEvent[]>>>((groups, event) => ({
            ...groups,
            ...Object.fromEntries(summaryToGroup(event.summary).map(group => [
                group,
                {
                    ...(groups[group] ?? []),
                    [event.date]:[
                        ...(groups?.[group]?.[event.date] ?? []),
                        event
                    ]
                }
            ]))
        }), {});
        setGroups(groups);
    }, [calendar]);

    return <div className={"border-t border-b border-black/20 bg-gray-200"}><Responsive>
        <Section title="Die nächsten 7 Tage">
            {calendar.error ? <CalendarErrorNotice/> :
                <div className="grid lg:grid-cols-2 gap-8">
                    {Object.entries(groups)
                        .map(([group, calendar]) => <div className="border border-black/20 rounded-xl p-4">
                                <div className="text-2xl font-bold text-center">{group}</div>
                                <div>{Object.entries(calendar).map(([date, events]) =>
                                    <div>
                                        <div className="my-2">
                                            <EventDateText date={new Date(date)}/>
                                        </div>
                                        {(events ?? []).map(event => <Event event={event} permissions={{}}/>)}
                                    </div>
                                )}
                                </div>
                            </div>
                        )}
                    <CalendarCacheNotice/>
                </div>
            }
        </Section></Responsive></div>;
}