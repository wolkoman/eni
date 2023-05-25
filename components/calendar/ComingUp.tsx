import React from 'react';
import {groupEventsByDate, groupEventsByGroup,} from '../../util/use-calendar-store';
import Responsive from '../Responsive';
import Link from "next/link";
import {useEmmausProd} from "../../util/use-emmaus-prod";
import {CalendarEvent, CalendarGroup, EventsObject} from "../../util/calendar-types";
import {Preference, usePreference} from "../../util/use-preference";
import {CalendarName} from "../../util/calendar-info";
import {site} from "../../util/sites";
import {getGroupSorting} from "../../util/calendar-group";
import {ListView} from "./ListView";

export const unibox = "bg-black/[2%]  rounded-lg border border-black/[5%]";
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
            <div className={`grid lg:grid-cols-2 gap-8 py-4`}>
                {groups.slice(0, 6).map(([group, eventsObject]) =>
                    <Link
                        href={`${urlPrefix}/termine?q=${encodeURIComponent(group)}`} key={group}
                        className={`p-4 pb-8 bg-black/[2%] border border-black/[5%] rounded-xl relative overflow-hidden`}
                    >
                        <div className="flex gap-2 items-start justify-center my-4">
                            <div className="text-xl font-bold">{group}</div>
                        </div>
                        <div>
                            <ListView editable={false} calendar={{
                                items: Object.values(eventsObject).flat(),
                                error: false,
                                loading: false,
                                loaded: true
                            }} liturgy={{}} filter={null}/>
                        </div>
                    </Link>
                )}
                {groups.slice(6).map(([group]) =>
                    <Link
                        href={`${urlPrefix}/termine?q=${encodeURIComponent(group)}`}
                        className={`rounded-2xl text-xl text-center font-bold ${clickable} p-4 block`}
                    >
                        {group}
                    </Link>)}
            </div>
            <Link href={`${urlPrefix}/termine`}
                  className={`rounded-2xl text-xl text-center font-bold ${clickable} p-4 mt-2 block`}>
                Alle Termine
            </Link>
        </div>
    </Responsive>;
}