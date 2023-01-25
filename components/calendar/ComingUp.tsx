import React from 'react';
import {groupEventsByDate, groupEventsByGroup,} from '../../util/use-calendar-store';
import Responsive from '../Responsive';
import {SectionHeader} from "../SectionHeader";
import Link from "next/link";
import {useEmmausProd} from "../../util/use-emmaus-prod";
import {CalendarEvent, CalendarGroup, EventsObject} from "../../util/calendar-types";
import {Preference, usePreference} from "../../util/use-preference";
import {CalendarName} from "../../util/calendar-info";
import {Event2, EventDateText, ParishTag2} from "./Event";

export function getGroupSorting(group: CalendarGroup) {
    return [CalendarGroup.Gebet, CalendarGroup.Wallfahrt, CalendarGroup.Advent, CalendarGroup.Gottesdienst, CalendarGroup.Messe, CalendarGroup.Weihnachten].indexOf(group);
}

export function ComingUp(props: { eventsObject: EventsObject }) {
    const [separateMass] = usePreference(Preference.SeparateMass);
    const groups = Object.entries(groupEventsByGroup(props.eventsObject.events, separateMass))
        .sort(([group1], [group2]) => getGroupSorting(group2 as CalendarGroup) - getGroupSorting(group1 as CalendarGroup))
        .slice(0, 6)
        .map(([group, events]) => [group,
            groupEventsByDate([CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT]
                .flatMap(calendar => events
                    .filter(event => event.calendar === calendar)
                    .slice(0, 1)
                )
                .sort((b, a) => b.start.dateTime.localeCompare(a.start.dateTime))
            )]) as [string, Record<string, CalendarEvent[]>][]
    const urlPrefix = useEmmausProd() ? 'https://eni.wien' : '';

    return <Responsive>
        <div className="my-8">
            <SectionHeader id="termine">Termine</SectionHeader>
            <div className="grid md:grid-cols-2 gap-4 py-4">
                {groups.map(([group, eventsObject]) =>
                    <Link href={`${urlPrefix}/termine?q=${encodeURIComponent(group)}`} key={group}
                          className={"overflow-hidden rounded-2xl bg-black/[2%] hover:bg-black/[4%] relative py-6 cursor-pointer"}
                    >
                        <div className="text-2xl font-bold text-center">{group}</div>
                        <div>
                            {Object.entries(eventsObject).map(([date, events]) => <>
                                <div className="ml-24 pl-2 mt-2"><EventDateText date={new Date(date)}/></div>
                                    {events.map(event => <div key={event.id} className="flex items-start gap-2">
                                        <ParishTag2 calendar={event.calendar}/>
                                        <div className="my-1">
                                            <Event2 key={event.id} event={event}/>
                                        </div>
                                    </div>)}
                                </>
                            )}
                        </div>
                    </Link>
                )}
            </div>
            <div className="flex flex-wrap gap-4 pb-4">
                {groups.slice(7).map(([group]) => <Link
                    href={`${urlPrefix}/termine?q=${encodeURIComponent(group)}`}
                    className={"flex-grow rounded-2xl text-xl text-center font-bold bg-black/[2%] hover:bg-black/[4%] p-4 cursor-pointer"}
                    key={group}>
                    {group}
                </Link>)}
            </div>
            <Link href={`${urlPrefix}/termine`}
                  className="rounded-2xl text-xl text-center font-bold bg-black/[2%] hover:bg-black/[4%] p-4 cursor-pointer block">
                Alle Termine
            </Link>
        </div>
    </Responsive>;
}