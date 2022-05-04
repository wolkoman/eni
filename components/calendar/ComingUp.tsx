import {CalendarCacheNotice} from './CalendarCacheNotice';
import {CalendarErrorNotice} from './CalendarErrorNotice';
import React, {ReactNode, useEffect, useState} from 'react';
import {CalendarEvent} from '../../util/calendar-events';
import {useCalendarStore} from '../../util/use-calendar-store';
import {useUserStore} from '../../util/use-user-store';
import {Section} from '../Section';
import {Event, EventDateText} from './Event';
import Responsive from '../Responsive';
import {SectionHeader} from "../SectionHeader";
import Link from "next/link";

export function ComingUp({}) {
    const calendar = useCalendarStore(state => state);
    const [groups, setGroups] = useState<Record<string, Record<string, CalendarEvent[]>>>({});
    const [jwt] = useUserStore(state => [state.jwt]);
    const now = new Date().getTime();
    const tomorrow = now + 3600 * 1000 * 24 * 7;

    useEffect(() => calendar.load(jwt), [jwt]);
    useEffect(() => {
        const events = Object.entries(calendar.items)
            .filter(([date]) => new Date(date) < new Date(tomorrow))
            .flatMap(([date, events]) => events
                .map(event => ({...event, date}))
            ).filter(event => event.visibility !== 'private');
        const groups = events.reduce<Record<string, Record<string, CalendarEvent[]>>>((groups, event) => ({
            ...groups,
            ...Object.fromEntries(event.groups?.map(group => [
                group,
                {
                    ...(groups[group] ?? []),
                    [event.date]: [
                        ...(groups?.[group]?.[event.date] ?? []),
                        event
                    ]
                }
            ]) ?? [])
        }), {});
        setGroups(groups);
    }, [calendar]);

    return <Responsive>
        <div className="my-20">
            <div className="flex justify-between">
                <SectionHeader>Die nächsten 7 Tage</SectionHeader>
                <Link href="/termine">
                    <div className="my-8 px-3 py-1 bg-white rounded-xl cursor-pointer underline hover:no-underline">Alle
                        Termine
                    </div>
                </Link>
            </div>
            {calendar.error ? <CalendarErrorNotice/> :
                <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(groups)
                        .map(([group, calendar]) => <div
                                className="max-h-96 overflow-hidden relative rounded-2xl border border-black/20 relative px-4 py-2 pb-12">
                                <Link href={`/termine?q=${encodeURIComponent(group)}`}>
                                    <div
                                        className="absolute w-full h-10 left-0 bottom-0 bg-[#fff] text-center">
                                        <div className="absolute top-0 left-0 w-full h-full bg-black/10 pt-2 cursor-pointer underline hover:no-underline">
                                            Alle {group} Termine
                                        </div>
                                    </div>
                                </Link>
                                <div className="text-xl font-bold text-center">{group}</div>
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
        </div>
    </Responsive>;
}
