import React, {useEffect, useState} from 'react';
import Site from '../../components/Site';
import {usePermission} from '../../util/use-permission';
import {useCalendarStore} from "../../util/use-calendar-store";
import {Permission} from "../../util/verify";
import {useUserStore} from "../../util/use-user-store";
import {CalendarEvent} from "../../util/calendar-events";
import {Event, EventDate, EventDateText} from "../../components/calendar/Event";

const musicDescriptionMatch = /(?<=^Musikal\. Gestaltung: )(.*)(?=$)/m;
export default function LimitedEventEditing() {
    const [event, setEvent] = useState<(CalendarEvent & {music?: string}) | undefined>();
    const [records, setRecords] = useState<[string, CalendarEvent[]][]>([]);
    const [loading, loaded, load, events, group] = useCalendarStore(state => [state.loading, state.loaded, state.load, state.items, state.groupByDate]);
    const jwt = useUserStore(state => state.jwt);
    usePermission([Permission.LimitedEventEditing]);
    useEffect(() => {
        if (!jwt) return;
        if (!loaded && !loading) load(jwt);
    }, [jwt, loading]);
    useEffect(() => {
        // @ts-ignore
        setRecords(Object.entries(group(events))
            .map(([date, events]) => [date, events.filter(event =>
                event.calendar === 'inzersdorf'
                && (event.groups.includes("Heilige Messe") || event.groups.includes("Gottesdienst"))
            )])
            .filter(([, events]) => events.length !== 0)
        );
    }, [events]);
    useEffect(() => {
        if(!event) return;
        const match = (event.description ?? "").match(musicDescriptionMatch) ?? [''];
        event.music = match[0] ?? "";
    }, [event]);

    return <Site title="Termine bearbeiten">
        <div className="mt-8 grid md:grid-cols-2 flex-grow overflow-y-auto flex-[1_0_0] gap-6 bg-black/10 rounded-lg">
            <div className="flex flex-col overflow-y-scroll border-8 border-black/10 bg-white px-4 rounded-lg">
                {records.map(([date, events]) => <div key={date}>
                    <EventDate date={new Date(date)}/>
                    {events.filter(event => event.calendar === 'inzersdorf').map(event => <div
                        key={event.id}
                        className="cursor-pointer hover:bg-black/5 px-2"
                        onClick={() => setEvent(event)}
                    ><Event
                        event={event} permissions={{}}/></div>)}
                </div>)}
            </div>
            <div className=" my-8">
                <div className="text-3xl font-bold my-4">{event?.summary}</div>
                <div className="text-lg my-2"><EventDateText date={new Date(event?.date!)}/></div>
                <div className="text-lg my-2">{new Date(event?.start.dateTime!).toLocaleTimeString()}</div>
                <div className="text-lg my-2">{event?.description}</div>
                <input className="text-lg my-2" defaultValue={event?.music ?? ""}></input>
            </div>
        </div>
    </Site>
}