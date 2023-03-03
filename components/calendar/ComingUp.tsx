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
import {ParishTag} from "./ParishTag";
import {EventDateText} from "./EventUtils";

export const unibox = "bg-black/[2%]  rounded-lg";
export const clickable = unibox+" hover:bg-black/[4%] cursor-pointer";
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
            <div className={`grid gap-4 py-4`}>
                {groups.map(([group, eventsObject]) =>
                    <Link
                        href={`${urlPrefix}/termine?q=${encodeURIComponent(group)}`} key={group}
                        className={`grid grid-cols-2 relative border-b border-black/10 py-4`}
                    >
                        <div className="">
                            <div className="text-2xl font-bold">{group}</div>
                            <div className="text-lg max-w-sm">{{
                                [CalendarGroup.Messe]: "Gottesdienst mit Eucharistiefeier, bei der die Gläubigen die gegenwärtige Christi im Brot und Wein empfangen",
                                [CalendarGroup.Gottesdienst]: "Religiöse Feiern und Zusammenkünfte, um Gott zu ehren",
                                [CalendarGroup.Gebet]: "Treffen, um gemeinsam zu beten und die Bibel zu lesen und zu diskutieren",
                                [CalendarGroup.Gemeinschaft]: "Veranstaltung zur Förderung des Zusammenhalts und der Gemeinschaft innerhalb der Pfarre",
                                [CalendarGroup.Kinder]: "Veranstaltung für Kinder, die spielerisch den katholischen Glauben kennenlernen und leben können",
                                [CalendarGroup.Gremien]: "Gruppen, die sich mit der Verwaltung und Organisation der Pfarre befassen und Entscheidungen treffen",
                                [CalendarGroup.Advent]: "Vorbereitungszeit vor Weihnachten, in der die Ankunft Jesu Christi erwartet wird",
                                [CalendarGroup.Jugend]: "Veranstaltungen und Aktivitäten für Jugendliche, um den katholischen Glauben zu fördern und Gemeinschaft zu erleben",
                                [CalendarGroup.Fastenzeit]: "Zeitraum vor Ostern, in der man sich auf den Glauben und die Buße besinnt und durch Verzicht und Gebet darauf vorbereitet",
                                [CalendarGroup.Ostern]: "Höhepunkt des christlichen Glaubens, bei dem die Auferstehung Jesu Christi gefeiert wird",
                                [CalendarGroup.Karwoche]: "Woche vor Ostern, in der an das Leiden und Sterben Jesu Christi erinnert wird",
                                [CalendarGroup.Sakramente]: "Heilige Handlungen der katholischen Kirche, die Gnade und Segen vermitteln",
                                [CalendarGroup.Chor]: "Gruppe, die bei religiösen Feiern und Gottesdiensten singt und musiziert",
                            }[group]}</div>
                        </div>
                        <div>
                            {Object.entries(eventsObject).map(([date, events]) => <>
                                    <div className={`${site('', '')} mt-2`}><EventDateText date={new Date(date)}/>
                                    </div>
                                    {events.map(event => <div key={event.id} className="flex items-start gap-2">
                                        <div className="my-1">
                                            <Event key={event.id} event={event}/>
                                        </div>
                                    </div>)}
                                </>
                            )}
                        </div>
                    </Link>
                )}
            </div>
            <Link href={`${urlPrefix}/termine`} className={`rounded-2xl text-xl text-center font-bold ${clickable} p-4 block`}>
                Alle Termine
            </Link>
        </div>
    </Responsive>;
}