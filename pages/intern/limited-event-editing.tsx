import React, {useEffect, useState} from 'react';
import Site from '../../components/Site';
import {usePermission} from '../../util/use-permission';
import {groupEventsByDate, useCalendarStore} from "../../util/use-calendar-store";
import {Permission} from "../../util/verify";
import {useUserStore} from "../../util/use-user-store";
import {CalendarEvent} from "../../util/calendar-events";
import {Event, EventDate, EventDateText} from "../../components/calendar/Event";
import {fetchJson} from "../../util/fetch-util";

export const musicDescriptionMatch = /(?<=^Musikal\. Gestaltung: )(.*)(?=$)/m;
export default function LimitedEventEditing() {
    const [music, setMusic] = useState("");
    const [event, setEvent] = useState<CalendarEvent | undefined>();
    const [records, setRecords] = useState<[string, CalendarEvent[]][]>([]);
    const [loading, loaded, load, events] = useCalendarStore(state => [state.loading, state.loaded, state.load, state.items]);
    const jwt = useUserStore(state => state.jwt);
    usePermission([Permission.LimitedEventEditing]);
    useEffect(() => {
        if (!jwt) return;
        if (!loaded && !loading) load(jwt);
    }, [jwt, loading]);
    useEffect(() => {
        setRecords(Object.entries(groupEventsByDate(events.filter(event =>
                event.calendar === 'inzersdorf'
                && (event.groups.includes('Heilige Messe') || event.groups.includes('Gottesdienst'))
            )))
                .filter(([, events]) => events.length !== 0)
        );
    }, [events]);
    useEffect(() => {
        if (!event) return;
        const match = (event.description ?? "").match(musicDescriptionMatch) ?? [''];
        console.log(match);
        setMusic(match[0] ?? "");
    }, [event]);

    function saveMusic() {
        fetchJson("/api/calendar/music", {json: {music, eventId: event?.id}, jwt}, {
            success: "Musik wurde gespeichert",
            error: "Ein Fehler hat das Speichern verhindert",
            pending: "Musik wird gespeichert..."
        }).then(event => {
            load(jwt);
            setEvent(event);
        });
    }

    return <Site title="Termine bearbeiten">
        <div className="mt-8 grid md:grid-cols-2 bg-black/10 rounded-lg md:overflow-y-auto md:flex-[1_0_0]">
            <div
                className="flex flex-col overflow-y-scroll border-4 border-black/10 bg-white px-4 rounded-lg max-h-96 md:max-h-[none]">
                {records.map(([date, events]) => <div key={date}>
                    <EventDate date={new Date(date)}/>
                    {events.filter(event => event.calendar === 'inzersdorf').map(event => <div key={event.id} className="cursor-pointer hover:bg-black/5 px-2"
                        onClick={() => setEvent(event)}
                    ><Event
                        event={event} permissions={{}}/></div>)}
                </div>)}
            </div>
            {event && <div className="flex flex-col my-8 px-8">
                <div className="text-3xl font-bold my-2">{event?.summary}</div>
                <div className="text-lg my-1"><EventDateText
                    date={new Date(event?.date!)}/>, {new Date(event?.start.dateTime!).toLocaleTimeString()}</div>
                <div className="text-lg my-1">{event?.description}</div>
                <div className="flex-grow flex flex-col justify-end">
                    <div>Musikal. Gestaltung</div>
                    <div className="flex">
                        <input className="text-lg px-2 py-1" value={music}
                               onChange={({target}) => setMusic(target.value)}></input>
                        <button className="bg-emmaus text-white px-4 hover:opacity-80" onClick={saveMusic}>Speichern
                        </button>
                    </div>
                </div>
            </div>}
        </div>
    </Site>
}