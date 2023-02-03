import React from 'react';
import {groupEventsByDate, groupEventsByGroup,} from '../../util/use-calendar-store';
import Responsive from '../Responsive';
import {SectionHeader} from "../SectionHeader";
import Link from "next/link";
import {useEmmausProd} from "../../util/use-emmaus-prod";
import {CalendarEvent, CalendarGroup, EventsObject} from "../../util/calendar-types";
import {Preference, usePreference} from "../../util/use-preference";
import {CalendarName} from "../../util/calendar-info";
import {Event, Event2} from "./Event";
import {site} from "../../util/sites";
import {getGroupSorting} from "../../util/calendar-group";
import {ParishTag2} from "./ParishTag";
import {EventDateText} from "./EventUtils";

export const unibox = "bg-black/[2%] border border-black/10";
export const clickable = `${unibox} bg-black/[2%] hover:bg-black/[4%] cursor-pointer border border-black/10`;
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
                {groups.slice(0,8).map(([group, eventsObject]) =>
                    <Link
                        href={`${urlPrefix}/termine?q=${encodeURIComponent(group)}`} key={group}
                        className={`overflow-hidden rounded-2xl ${clickable} relative py-6 ${site('px-2 lg:px-0', 'px-6')}`}
                    >
                        <div className="text-2xl font-bold text-center">{group}</div>
                        <div>
                            {Object.entries(eventsObject).map(([date, events]) => <>
                                    <div className={`${site('lg:ml-24 lg:pl-2', '')} mt-2`}><EventDateText date={new Date(date)}/>
                                    </div>
                                    {events.map(event => <div key={event.id} className="flex items-start gap-2">
                                        <div className="hidden lg:block mt-1.5">
                                            {site(<ParishTag2 calendar={event.calendar}/>, <div/>)}
                                        </div>
                                        <div className="my-1">
                                            <Event2 key={event.id} event={event} hideTagOnLarge={true}/>
                                        </div>
                                    </div>)}
                                </>
                            )}
                        </div>
                    </Link>
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