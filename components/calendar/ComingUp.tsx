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

function getGroupSorting(group: string) {
    return ['Gebet & Bibel', 'Gottesdienst', 'Heilige Messe'].indexOf(group);
}

export function ComingUp({}) {
    const calendar = useCalendarStore(state => state);
    const [groups, setGroups] = useState<Record<string, Record<string, CalendarEvent[]>>>({});
    const [jwt] = useUserStore(state => [state.jwt]);
    const now = new Date().getTime();
    const tomorrow = now + 3600 * 1000 * 24 * 7;

    useEffect(() => calendar.load(jwt), [jwt]);
    useEffect(() => {
        const events = calendar.items
            .filter(event => new Date(event.date) < new Date(tomorrow))
            .filter(event => event.visibility !== 'private');
        setGroups(calendar.groupByDateAndGroup(events));
    }, [calendar]);

    return <Responsive>
        <div className="my-20">
            <div className="flex justify-between">
                <SectionHeader>Die nächsten 7 Tage</SectionHeader>
                <Link href="/termine">
                    <div className="my-8 px-3 py-1 bg-white rounded-xl cursor-pointer underline hover:no-underline">
                        Alle Termine
                    </div>
                </Link>
            </div>
            {calendar.error ? <CalendarErrorNotice/> :
                <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(groups).sort(([group1], [group2]) => getGroupSorting(group2) - getGroupSorting(group1))
                        .map(([group, calendar]) => <div
                                className="max-h-96 overflow-hidden relative rounded-2xl border border-black/10 relative px-4 py-2 pb-12 shadow">
                                <Link href={`/termine?q=${encodeURIComponent(group)}`}>
                                    <div
                                        className="absolute w-full h-10 left-0 bottom-0 bg-[#fff] text-center">
                                        <div
                                            className="absolute top-0 left-0 w-full h-full bg-black/5 pt-2 cursor-pointer underline hover:no-underline">
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
                    <Link href="/termine">
                        <div
                            className="rounded-2xl text-3xl font-bold bg-black/5 p-12 border border-black/10 shadow cursor-pointer">
                            Alle Termine
                        </div>
                    </Link>
                    <CalendarCacheNotice/>
                </div>
            }
        </div>
    </Responsive>;
}
