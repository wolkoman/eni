import React from 'react';
import Responsive from "./Responsive";
import {getWeekDayName} from "./calendar/Calendar";
import {CalendarGroup} from "@/domain/events/CalendarGroup";
import {CalendarTag, EventsObject} from "@/domain/events/EventMapper";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {getTimeOfEvent} from "@/domain/events/EventSorter";
import {loadCachedEvents} from "@/domain/events/EventsLoader";
import {EventLoadAccess} from "@/domain/events/EventLoadOptions";

export async function EmmausBranding() {
    const eventsObject = await loadCachedEvents({access: EventLoadAccess.PUBLIC})

    const event = eventsObject.events
        .sort((a, b) => getTimeOfEvent(a) - getTimeOfEvent(b))
        .filter(event => new Date(event.start.dateTime) > new Date())
        .filter(event => event.groups.includes(CalendarGroup.Messe) || event.groups.includes(CalendarGroup.Gottesdienst))[0];
    const announcements = eventsObject.events
        .filter(event => event.tags.includes(CalendarTag.announcement))

    return <div className="bg-emmaus pt-16 md:pt-36 relative overflow-hidden">
        <Responsive>
            <div className="flex flex-col md:flex-row justify-around">
                <div className="text-white relative flex flex-col">
                    <div>
                        <div className="text-2xl md:text-3xl opacity-50">Römisch-katholische</div>
                        <div className="text-4xl md:text-6xl font-bold">Pfarre Emmaus</div>
                        <div className="text-4xl md:text-6xl font-bold">am Wienerberg</div>
                    </div>
                    <div>
                        {event && <div>
                            <div className={`${announcements.length > 0 ? 'bg-white/70' : 'bg-emmaus-sec'} text-black text-xl inline-flex px-4 py-2 rounded mt-12`}>
                                <div className="mr-2">
                                    {getWeekDayName(new Date(event.date).getDay())}, {event.time} Uhr:
                                </div>
                                <div className="font-bold">{event.summary}</div>
                            </div>
                        </div>}
                        {announcements.map(annoucment => <div>
                            <div className="bg-emmaus-sec text-black text-xl inline-flex px-4 py-2 rounded mt-2">
                                <div className="mr-2">
                                    {new Date(annoucment.date).toLocaleDateString("de-AT")}, {annoucment.time} Uhr:
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
