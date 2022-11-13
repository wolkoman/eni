import React from 'react';
import {groupEventsByGroupAndDate} from '../../util/use-calendar-store';
import {Event, EventDateText} from './Event';
import Responsive from '../Responsive';
import {SectionHeader} from "../SectionHeader";
import Link from "next/link";
import {useEmmausProd} from "../../util/use-emmaus-prod";
import {CalendarGroup, EventsObject} from "../../util/calendar-types";

export function getGroupSorting(group: CalendarGroup) {
    return [CalendarGroup.Gebet, CalendarGroup.Wallfahrt, CalendarGroup.Advent, CalendarGroup.Gottesdienst, CalendarGroup.Messe, CalendarGroup.Weihnachten].indexOf(group);
}

export function ComingUp(props: { eventsObject: EventsObject }) {
    const now = new Date().getTime();
    const groups = Object.entries(groupEventsByGroupAndDate(props.eventsObject.events.filter(event => new Date(event.date).getTime() < now + 1000 * 60 * 60 * 24 * 7)))
        .sort(([group1], [group2]) => getGroupSorting(group2 as CalendarGroup) - getGroupSorting(group1 as CalendarGroup))
    const urlPrefix = useEmmausProd() ? 'https://eni.wien' : '';

    return <Responsive>
        <div className="mb-20">
            <div className="flex justify-between">
                <SectionHeader id="termine">Die nächsten 7 Tage</SectionHeader>
            </div>
            <div className="grid md:grid-cols-2 gap-4 py-4">
                {groups
                    .slice(0, 6)
                    .map(([group, calendar], index) =>
                        <Link href={`${urlPrefix}/termine?q=${encodeURIComponent(group)}`} key={group}>
                            <div className={(index < 2 ? "max-h-96" : "max-h-64") + " overflow-hidden rounded-2xl bg-black/5 hover:bg-black/10 relative p-6 cursor-pointer"}>
                                <div className="text-2xl font-bold text-center">{group}</div>
                                <div>{Object.entries(calendar).map(([date, events]) =>
                                    <div key={date}>
                                        <div className="my-2"><EventDateText date={new Date(date)}/></div>
                                        {(events ?? []).map(event => <Event key={event.id} event={event}
                                                                            permissions={{}}/>)}
                                    </div>
                                )}
                                </div>
                            </div>
                        </Link>
                    )}
            </div>
            <div className="flex gap-4 pb-4">
                {groups.slice(7).map(([group]) => <Link href={`${urlPrefix}/termine?q=${encodeURIComponent(group)}`} key={group}>
                    <div
                        className="flex-1 rounded-2xl text-xl text-center font-bold bg-black/5 hover:bg-black/10 p-4 cursor-pointer">
                        {group}
                    </div>
                </Link>)}
            </div>
            <Link href={`${urlPrefix}/termine`}>
                <div
                    className="rounded-2xl text-xl text-center font-bold bg-black/5 hover:bg-black/10 p-4 cursor-pointer">
                    Alle Termine
                </div>
            </Link>
        </div>
    </Responsive>;
}