import React from 'react';
import Responsive from "./Responsive";
import {CalendarName, getCalendarInfo} from "../util/calendar-info";
import {getTimeOfEvent} from "../util/get-time-of-event";
import {getWeekDayName} from "./calendar/Calendar";
import {CalendarGroup, EventsObject} from "../util/calendar-types";

export function EmmausBranding(props: { eventsObject: EventsObject }) {

    const event = props.eventsObject.events
        .sort((a, b) => getTimeOfEvent(a) - getTimeOfEvent(b))
        .filter(event => new Date(event.start.dateTime) > new Date())
        .filter(event => event.groups.includes(CalendarGroup.Messe) || event.groups.includes(CalendarGroup.Gottesdienst))[0];

    return <div className={"bg-emmaus pt-8 md:pt-24 relative overflow-hidden"}>
        <Responsive>
            <div className="flex flex-col md:flex-row justify-around">
                <div className="text-white relative flex flex-col">
                    <div>
                        <div className="text-5xl md:text-7xl font-bold">Pfarre Emmaus</div>
                        <div className="text-4xl">am Wienerberg</div>
                    </div>
                    {event && <div>
                        <div className="bg-emmaus-sec text-black text-xl inline-flex px-4 py-2 rounded my-12">
                            <div className="mr-2">Nächste {event.summary}:</div>
                            <div className="font-bold">
                                {getWeekDayName(new Date(event.date).getDay())}, {new Date(event.start.dateTime).toLocaleTimeString().substring(0, 5)}
                            </div>
                        </div>
                    </div>}
                </div>
                <img className="self-end h-72 md:h-96 relative" src={getCalendarInfo(CalendarName.EMMAUS).image}/>
            </div>
        </Responsive>
    </div>;
}