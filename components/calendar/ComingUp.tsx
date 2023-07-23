"use client"

import React from 'react';
import {groupEventsByDate, groupEventsByGroup,} from '../../util/store/use-calendar-store';
import Responsive from '../Responsive';
import {useEmmausProd} from "../../util/use-emmaus-prod";
import {CalendarEvent, CalendarGroup, EventsObject} from "../../util/calendar-types";
import {Preference, usePreference} from "../../util/store/use-preference";
import {CalendarName} from "../../util/calendar-info";
import {site} from "../../util/sites";
import {getGroupSorting} from "../../util/calendar-group";
import {ListView} from "./ListView";
import {SectionHeader} from "../SectionHeader";
import {Clickable} from "../../app/(components)/Clickable";

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
                .sort((b, a) => b.start.dateTime?.localeCompare(a.start.dateTime))
            )]) as [string, Record<string, CalendarEvent[]>][]
    const urlPrefix = useEmmausProd() ? 'https://eni.wien' : '';

    return <Responsive>
        <div className="my-8">
            <SectionHeader id="coming-up">Die nächsten Tage</SectionHeader>
            <div className={`grid lg:grid-cols-2 gap-8 py-4`}>
                {groups.slice(0, 6).map(([group, eventsObject]) =>
                    <Clickable
                        href={`${urlPrefix}/termine?q=${encodeURIComponent(group)}`} key={group}
                        className={`p-4 pb-8 rounded-xl relative overflow-hidden`}
                    >
                        <div className="flex gap-2 items-start justify-center my-4">
                            <div className="text-2xl font-bold">{group}</div>
                        </div>
                        <div>
                            <ListView editable={false} calendar={{
                                items: Object.values(eventsObject).flat(),
                                error: false,
                                loading: false,
                                loaded: true
                            }} liturgy={{}} filter={null}/>
                        </div>
                    </Clickable>
                )}
                {groups.slice(6).map(([group]) =>
                    <Clickable
                        href={`${urlPrefix}/termine?q=${encodeURIComponent(group)}`}
                        className={`rounded-2xl text-xl text-center font-bold p-4 block`}
                    >
                        {group}
                    </Clickable>)}
            </div>
            <Clickable href={`${urlPrefix}/termine`}
                  className={`rounded-2xl text-xl text-center font-bold p-4 mt-2 block`}>
                Alle Termine
            </Clickable>
        </div>
    </Responsive>;
}
