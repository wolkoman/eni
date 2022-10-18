import {CalendarCacheNotice} from './CalendarCacheNotice';
import React from 'react';
import {groupEventsByGroupAndDate} from '../../util/use-calendar-store';
import {Event, EventDateText} from './Event';
import Responsive from '../Responsive';
import {SectionHeader} from "../SectionHeader";
import Link from "next/link";
import {useEmmausProd} from "../../util/use-emmaus-prod";
import {CalendarGroup, EventsObject} from "../../util/calendar-types";

export function getGroupSorting(group: CalendarGroup) {
    return [CalendarGroup.Gebet, CalendarGroup.Wallfahrt, CalendarGroup.Gottesdienst, CalendarGroup.Weihnachten, CalendarGroup.Messe].indexOf(group);
}

export function ComingUp(props: { eventsObject: EventsObject }) {
    const now = new Date().getTime();
    const groups = groupEventsByGroupAndDate(props.eventsObject.events.filter(event => new Date(event.date).getTime() < now + 1000 * 60 * 60 * 24 * 7));
    const urlPrefix = useEmmausProd() ? 'https://eni.wien' : '';

    return <Responsive>
        <div className="my-20">
            <div className="flex justify-between">
                <SectionHeader id="termine">Die nächsten 7 Tage</SectionHeader>
                <Link href={`${urlPrefix}/termine`}>
                    <div
                        className="my-9 px-3 py-1 bg-white rounded-lg cursor-pointer bg-black/10 hover:bg-black/5 transition-all">
                        Alle Termine
                    </div>
                </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(groups).sort(([group1], [group2]) => getGroupSorting(group2 as CalendarGroup) - getGroupSorting(group1 as CalendarGroup))
                    .map(([group, calendar]) => <div
                            key={group}
                            className="max-h-96 overflow-hidden relative rounded-2xl border-2 border-black/10 relative px-4 py-2 pb-12">
                            <Link href={`${urlPrefix}/termine?q=${encodeURIComponent(group)}`}>
                                <div className="absolute w-full h-10 left-0 bottom-0 bg-[#fff]">
                                    <div
                                        className="w-full h-full bg-black/10 hover:pl-5 transition-all hover:bg-black/5 pt-2 cursor-pointer">
                                        <div className="flex justify-center items-center space-x-2">
                                            <div>Alle {group} Termine</div>
                                            <Icon/>
                                        </div>
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
                <Link href={`${urlPrefix}/termine`}>
                    <div
                        className="rounded-2xl text-3xl font-bold bg-black/10 hover:bg-black/5 p-12 cursor-pointer transition-all">
                        Alle Termine
                    </div>
                </Link>
                <CalendarCacheNotice/>
            </div>
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