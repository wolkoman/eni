import React from 'react';
import {EventDateText, EventTime} from "../../../components/calendar/EventUtils";
import {GetEventPermission} from "../EventMapper";
import {loadEvents} from "../EventsLoader";

export const revalidate = 3000

export default async function EventPage() {

    const eventsObject= await loadEvents({permission: GetEventPermission.PUBLIC})

    return <div data-testid="calendar" className="relative">
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;600&display=swap" rel="stylesheet"/>
        <div className="flex-grow events mt-4 lg:px-0 relative font-[Rubik]">
            <div className="font-bold text-sm mb-4 text-[#000] tracking-tighter">AKTUELLE VERANSTALTUNGEN:</div>
            {eventsObject.events
                .filter(event => event.calendar === 'inzersdorf' && !event.summary.match(/Messe|Taufe|(?<!-)Wortgottesdienst|ENTFÄLLT/))
                .slice(0, 3)
                .map(event => <div key={event.id} className="mb-4">
                    <div className="text-[#e05f28] font-semibold text-[17px] mb-0.5">
                        {event.summary}
                    </div>
                    <div className="text-[13px]">
                        <EventDateText date={new Date(event.date)}/> um <EventTime
                        date={new Date(event.start.dateTime)}/> Uhr
                    </div>
                </div>)}
            <div className="font-bold text-sm mb-4 text-[#1e74a9]">
                <a href="https://eni.wien/termine" target="_parent">
                    Alle Veranstaltungen anzeigen
                </a>
            </div>
        </div>
        <style>{"body{ background:none; }"}</style>
    </div>;
}
