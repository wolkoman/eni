import React from 'react';
import Responsive from "./Responsive";
import {getWeekDayName} from "./calendar/Calendar";
import {CalendarGroup} from "@/domain/events/CalendarGroup";
import {CalendarTag, EventsObject} from "@/domain/events/EventMapper";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {getTimeOfEvent} from "@/domain/events/EventSorter";

export function EmmausBranding(props: { eventsObject: EventsObject }) {

    const event = props.eventsObject.events
        .sort((a, b) => getTimeOfEvent(a) - getTimeOfEvent(b))
        .filter(event => new Date(event.start.dateTime) > new Date())
        .filter(event => event.groups.includes(CalendarGroup.Messe) || event.groups.includes(CalendarGroup.Gottesdienst))[0];
    const annoucments = props.eventsObject.events
        .filter(event => event.tags.includes(CalendarTag.announcement))

    return <div className={"bg-emmaus pt-8 md:pt-24 relative overflow-hidden"}>
        <div className="bg-gradient-to-t from-black/40 to-black/0 absolute bottom-0 w-full h-12"/>
        <Responsive>
            <div className="flex flex-col md:flex-row justify-around">
                <div className="text-white relative flex flex-col">
                    <div>
                        <div className="text-5xl md:text-7xl font-bold">Pfarre Emmaus</div>
                        <div className="text-4xl">am Wienerberg</div>
                    </div>
                    <div>
                        {event && <div>
                            <div className={`${annoucments.length > 0 ? 'bg-white/70' : 'bg-emmaus-sec'} text-black text-xl inline-flex px-4 py-2 rounded mt-12`}>
                                <div className="mr-2">
                                    {getWeekDayName(new Date(event.date).getDay())}, {new Date(event.start.dateTime).toLocaleTimeString("de-AT").substring(0, 5)} Uhr:
                                </div>
                                <div className="font-bold">{event.summary}</div>
                            </div>
                        </div>}
                        {annoucments.map(annoucment => <div>
                            <div className="bg-emmaus-sec text-black text-xl inline-flex px-4 py-2 rounded mt-2">
                                <div className="mr-2">
                                    {new Date(annoucment.date).toLocaleDateString("de-AT")}, {new Date(annoucment.start.dateTime).toLocaleTimeString("de-AT").substring(0, 5)} Uhr:
                                </div>
                                <div className="font-bold">{annoucment.summary}</div>
                            </div>
                        </div>)}
                    </div>
                </div>
                <img className="self-end h-72 md:h-96 relative" src={getCalendarInfo(CalendarName.EMMAUS).image}/>
            </div>
        </Responsive>
    </div>;
}
