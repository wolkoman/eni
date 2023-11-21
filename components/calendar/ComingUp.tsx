"use client"

import React from 'react';
import {groupEventsByDate, groupEventsByGroup,} from '@/store/CalendarStore';
import Responsive from '../Responsive';
import {Preference, usePreferenceStore} from "@/store/PreferenceStore";
import {ListView} from "./ListView";
import {SectionHeader} from "../SectionHeader";
import {CalendarEvent, EventsObject} from "@/domain/events/EventMapper";
import {CalendarGroup} from "@/domain/events/CalendarGroup";
import {CalendarName} from "@/domain/events/CalendarInfo";
import {getGroupSorting} from "@/domain/events/CalendarGroupSorter";
import {site} from "@/app/(shared)/Instance";
import Link from "next/link";

export function ComingUp(props: { eventsObject: EventsObject }) {
    const [separateMass] = usePreferenceStore(Preference.SeparateMass);
    const groups = Object.entries(groupEventsByGroup(props.eventsObject.events, separateMass))
        .sort(([group1], [group2]) => getGroupSorting(group2 as CalendarGroup) - getGroupSorting(group1 as CalendarGroup))
        .map(([group, events]) => [group,
            groupEventsByDate([CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT]
                .flatMap(calendar => events
                    .filter(event => event.calendar === calendar)
                    .slice(0, site(1, 3))
                )
                .sort((b, a) => b.start.dateTime?.localeCompare(a.start.dateTime))
            )]) as [string, Record<string, CalendarEvent[]>][]
    const urlPrefix = site('','https://eni.wien');

    return <Responsive>
        <div className="my-8">
            <SectionHeader id="coming-up">Die nächsten Tage</SectionHeader>
            <div className={`grid lg:grid-cols-2 gap-8 py-4`}>
                {groups.slice(0, 6).map(([group, eventsObject]) =>
                    <Link
                        key={group}
                        href={`${urlPrefix}/termine?q=${encodeURIComponent(group)}`}
                        className={`p-4 pb-8 rounded-xl border border-black/20`}
                    >
                        <div className="flex gap-2 mb-4 mt-2">
                            <div className="text-3xl font-semibold">{group}</div>
                        </div>
                        <div>
                            <ListView search="" editable={false} items={Object.values(eventsObject).flat()} liturgy={{}} filter={null}/>
                        </div>
                    </Link>
                )}
                {groups.slice(6).map(([group]) =>
                    <Link
                        key={group}
                        href={`${urlPrefix}/termine?q=${encodeURIComponent(group)}`}
                        className={`rounded-xl text-xl text-center font-bold p-4 border border-black/20`}
                    >
                        {group}
                    </Link>)}
                <Link href={`${urlPrefix}/termine`}
                      className={`rounded-xl text-xl text-center font-bold p-4 mt-2 border border-black/20`}>
                    Alle Termine
                </Link>
            </div>
        </div>
    </Responsive>;
}
