import React, {useEffect, useState} from 'react';
import {getCachedEvents, GetEventPermission} from "../../util/calendar-events";
import {CalendarEvent, EventsObject} from "../../util/calendar-types";
import {EventDateText, EventTime} from "../../components/calendar/EventUtils";
import {fetchJson} from "../../util/fetch-util";
import {useRouter} from "next/router";
import {ReaderInfo} from "../../util/reader";

function Countdown() {

    return null;
}

function EventShow(props: { event: CalendarEvent, index: number }) {
    return <div className="p-10 w-[100vw] h-full shrink-0 snap-center flex flex-col justify-center relative">
        <div className="text-xl">
            <EventDateText date={new Date(props.event.start.dateTime)}/>
        </div>
        <div className="text-5xl font-bold">
            <EventTime date={new Date(props.event.start.dateTime)}/> Uhr: {props.event.summary}
        </div>
        <div className="text-xl mt-4">
            <Duty label="1. Lesung">{props.event.readerInfo.reading1}</Duty>
            <Duty label="2. Lesung">{props.event.readerInfo.reading2}</Duty>
            <Duty label="1. Kommunionshelfer">{props.event.readerInfo.communionMinister1}</Duty>
            <Duty label="2. Kommunionshelfer">{props.event.readerInfo.communionMinister2}</Duty>
        </div>
        {props.index === 0 && <div className="absolute top-0 right-0">
            <Countdown/>
        </div>}
    </div>;
}

export default function EventPage(props: {eventsObject: EventsObject}) {

    const {query, reload} = useRouter();
    const [entries, setEntries] = useState<CalendarEvent[]>([]);
    const [start] = useState(new Date().getTime())
    const event = entries?.[2]

    useEffect(() => {
        const load = () => {
            if(new Date().getTime() - start > 1000 * 3600) {
                reload();
            }
            return fetchJson("/api/calendar/display?code=" + query.code)
                .then(data => setEntries(data));
        };
        load().then();
        const interval = setInterval(load, 1000 * 60 * 5);
        return () => clearInterval(interval);
    }, [setEntries, query])

    return <div className="bg-black h-screen text-white flex overflow-auto snap-x snap-mandatory">
        {entries.map((event, index) => <EventShow event={event} key={event.id} index={index}/>)}
    </div>;
}
function Duty(props: {label: string, children: ReaderInfo | undefined}){
    return props.children ? <div className={(props.children.status === "cancelled" ? "line-through" : "") + ""}>
        {props.label}: {props.children.name}
    </div> : <></>
}