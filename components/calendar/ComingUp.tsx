import {CalendarCacheNotice} from './CalendarCacheNotice';
import {CalendarErrorNotice} from './CalendarErrorNotice';
import React, {useEffect, useState} from 'react';
import {CalendarEvent} from '../../util/calendar-events';
import {useCalendarStore} from '../../util/use-calendar-store';
import {useUserStore} from '../../util/use-user-store';
import {Event, EventDateText} from './Event';
import Responsive from '../Responsive';
import {SectionHeader} from "../SectionHeader";
import Link from "next/link";

function getGroupSorting(group: string) {
    return ['Gebet & Bibel', 'Gottesdienst', 'Heilige Messe', 'Lange Nacht der Kirchen'].indexOf(group);
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
                <SectionHeader id="termine">Die nächsten 7 Tage</SectionHeader>
                <Link href="https://eni.wien/termine">
                    <div
                        className="my-9 px-3 py-1 bg-white rounded-lg cursor-pointer bg-black/10 hover:bg-black/5 transition-all">
                        Alle Termine
                    </div>
                </Link>
            </div>
            {calendar.error ? <CalendarErrorNotice/> :
                <div className="grid md:grid-cols-2 gap-4">
                    {calendar.loading && Array(5).fill(0).map((x, i) =>
                        <div key={i}
                             className="shimmer h-96 border-4 overflow-hidden relative rounded-2xl border border-black/10 relative px-4 py-2 pb-12 shadow"/>
                    )}

                    {Object.entries(groups).sort(([group1], [group2]) => getGroupSorting(group2) - getGroupSorting(group1))
                        .map(([group, calendar]) => <div
                                key={group}
                                className="max-h-96 overflow-hidden relative rounded-2xl border-4 border-black/10 relative px-4 py-2 pb-12">
                                <Link href={`https://eni.wien/termine?q=${encodeURIComponent(group)}`}>
                                    <div
                                        className="absolute w-full h-10 left-0 bottom-0 bg-[#fff]">
                                        <div
                                            className="absolute top-0 left-0 w-full h-full bg-black/10 hover:pl-5 transition-all hover:bg-black/5 pt-2 cursor-pointer">
                                            <div className="flex justify-center items-center space-x-2">
                                                Alle {group} Termine
                                                <Icon/></div>
                                        </div>
                                    </div>
                                </Link>
                                <div className="text-2xl font-bold text-center">{group}</div>
                                <div>{Object.entries(calendar).map(([date, events]) =>
                                    <div key={date}>
                                        <div className="my-2"><EventDateText date={new Date(date)}/></div>
                                        {(events ?? []).map(event => <Event key={event.id} event={event} permissions={{}}/>)}
                                    </div>
                                )}
                                </div>
                            </div>
                        )}
                    <Link href="https://eni.wien/termine">
                        <div
                            className="rounded-2xl text-3xl font-bold border-4 border-black/5 bg-black/10 hover:bg-black/5 p-12 shadow cursor-pointer transition-all">
                            Alle Termine
                        </div>
                    </Link>
                    <CalendarCacheNotice/>
                </div>
            }
        </div>
    </Responsive>;
}

export function Icon() {
    return <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg"
                className="mx-1">
        <path d="M1 6.5H15M15 6.5L9.25641 1M15 6.5L9.25641 12" stroke="#474747" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
    </svg>

        ;
}