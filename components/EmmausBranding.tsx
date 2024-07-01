import React from 'react';
import Responsive from "./Responsive";
import {getWeekDayName} from "./calendar/Calendar";
import {CalendarGroup} from "@/domain/events/CalendarGroup";
import {CALENDAR_INFO} from "@/domain/events/CalendarInfo";
import {getTimeOfEvent} from "@/domain/events/EventSorter";
import {loadCachedEvents} from "@/domain/events/EventsLoader";
import {EventLoadAccess} from "@/domain/events/EventLoadOptions";

export async function EmmausBranding() {
    const eventsObject = await loadCachedEvents({access: EventLoadAccess.PUBLIC})

    const event = eventsObject.events
      .sort((a, b) => getTimeOfEvent(a) - getTimeOfEvent(b))
      .filter(event => new Date(event.start.dateTime) > new Date())
      .filter(event => event.groups.includes(CalendarGroup.Messe) || event.groups.includes(CalendarGroup.Gottesdienst))[0];

    return <div className="bg-emmaus pt-16 md:pt-36 relative overflow-hidden">
        <Responsive>
            <div className="flex flex-col md:flex-row justify-around">
                <div className="relative flex flex-col text-white">
                    <div>
                        <div className="text-2xl md:text-3xl opacity-50">Römisch-katholische</div>
                        <div className="text-4xl md:text-6xl font-bold ">Pfarre Emmaus</div>
                        <div className="text-4xl md:text-6xl font-bold ">am Wienerberg</div>
                    </div>
                    <div>
                        {event &&
                          <div className={`bg-emmaus-sec text-black text-xl px-4 py-2 rounded mt-4 mb-4 lg:mt-12 inline-flex flex-wrap gap-2`}>
                            <div className="">
                                {getWeekDayName(new Date(event.date).getDay())}, {event.time} Uhr:
                            </div>
                            <div className="font-bold">{event.summary}</div>
                        </div>}
                    </div>
                </div>
                <img className="self-end h-72 md:h-96 relative" src={CALENDAR_INFO.image}/>
            </div>
        </Responsive>
    </div>;
}
