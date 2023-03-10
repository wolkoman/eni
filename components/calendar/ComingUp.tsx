import React from 'react';
import {groupEventsByDate, groupEventsByGroup,} from '../../util/use-calendar-store';
import Responsive from '../Responsive';
import {SectionHeader} from "../SectionHeader";
import Link from "next/link";
import {useEmmausProd} from "../../util/use-emmaus-prod";
import {CalendarEvent, CalendarGroup, EventsObject} from "../../util/calendar-types";
import {Preference, usePreference} from "../../util/use-preference";
import {CalendarName} from "../../util/calendar-info";
import {Event} from "./Event";
import {site} from "../../util/sites";
import {getGroupSorting} from "../../util/calendar-group";
import {EventDateText} from "./EventUtils";
import Button from "../Button";

export const unibox = "bg-black/[2%]  rounded-lg";
export const clickable = unibox + " hover:bg-black/[4%] cursor-pointer";

export function ComingUp(props: { eventsObject: EventsObject }) {
    const [separateMass] = usePreference(Preference.SeparateMass);
    const groups = Object.entries(groupEventsByGroup(props.eventsObject.events, separateMass))
        .sort(([group1], [group2]) => getGroupSorting(group2 as CalendarGroup) - getGroupSorting(group1 as CalendarGroup))
        .map(([group, events]) => [group,
            groupEventsByDate([CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT]
                .flatMap(calendar => events
                    .filter(event => event.calendar === calendar)
                    .slice(0, site(1, 3))
                )
                .sort((b, a) => b.start.dateTime.localeCompare(a.start.dateTime))
            )]) as [string, Record<string, CalendarEvent[]>][]
    const urlPrefix = useEmmausProd() ? 'https://eni.wien' : '';

    return <Responsive>
        <div className="my-8">
            <SectionHeader id="termine">Termine</SectionHeader>
            <div className={`grid md:grid-cols-2 gap-4 py-4`}>
                {groups.slice(0, 8).map(([group, eventsObject]) =>
                    <div key={group}
                         className={`overflow-hidden rounded-2xl border border-black/10 relative p-6 flex flex-col`}>
                        <Link href={`${urlPrefix}/termine?q=${encodeURIComponent(group)}`}>
                        <div className="text-2xl font-bold text-center underline hover:no-underline">{group}</div>
                        </Link>
                        <div>
                            {Object.entries(eventsObject).map(([date, events]) => <>
                                    <div className={` mt-2`}><EventDateText date={new Date(date)}/></div>
                                    {events.map(event => <div key={event.id} className="flex items-start gap-2">
                                        <div className="my-1">
                                            <Event key={event.id} event={event}/>
                                        </div>
                                    </div>)}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-wrap gap-4 pb-4">
                {groups.slice(8).map(([group]) => <Link
                    href={`${urlPrefix}/termine?q=${encodeURIComponent(group)}`}
                    className={`flex-grow rounded-2xl text-xl text-center font-bold ${clickable} p-4`}
                    key={group}>
                    {group}
                </Link>)}
            </div>
            <Link href={`${urlPrefix}/termine`}
                  className={`rounded-2xl text-xl text-center font-bold ${clickable} p-4 block`}>
                Alle Termine
            </Link>
        </div>
    </Responsive>;
}