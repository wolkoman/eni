"use client"
import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import {CalendarEvent} from "@/domain/events/EventMapper";
import {groupEventsByDate, useCalendarStore} from "@/store/CalendarStore";
import {CalendarName} from "@/domain/events/CalendarInfo";
import {CalendarGroup} from "@/domain/events/CalendarGroup";
import Site from "../../../components/Site";
import {EventDate, EventDateText} from "../../../components/calendar/EventUtils";
import {Event} from "../../../components/calendar/Event";
import {SanitizeHTML} from "../../../components/SanitizeHtml";
import {useUserStore} from "@/store/UserStore";
import {usePermission} from "@/app/(shared)/UsePermission";
import {Permission} from "@/domain/users/Permission";
import {fetchJson} from "@/app/(shared)/FetchJson";

export const musicDescriptionMatch = /Musikal\. Gestaltung: ([^<\n]*)/m;
export function LimitedEventEditingPage() {
    const [music, setMusic] = useState("");
    const [currentEvent, setCurrentEvent] = useState<CalendarEvent | undefined>();
    const [records, setRecords] = useState<[string, CalendarEvent[]][]>([]);
    const load = useCalendarStore(state => state.load);
    const user = useUserStore(state => state.user);
    const events = useCalendarStore(state => state.items);
    usePermission([Permission.LimitedEventEditing]);
    useEffect(() => {
        setRecords(Object.entries(groupEventsByDate(events.filter(event =>
                event.calendar === CalendarName.INZERSDORF
                && (event.groups.includes(CalendarGroup.Messe) || event.groups.includes(CalendarGroup.Gottesdienst))
            )))
                .filter(([, events]) => events.length !== 0)
        );
    }, [events]);
    useEffect(() => {
        if (!currentEvent) return;
        const match = currentEvent.description.match(musicDescriptionMatch) ?? [''];
        setMusic(match[1] ?? "");
    }, [currentEvent]);

    function saveMusic() {
        toast.promise(fetchJson("/api/calendar/music", {json: {music, eventId: currentEvent?.id}}), {
            success: "Musik wurde gespeichert",
            error: "Ein Fehler hat das Speichern verhindert",
            pending: "Musik wird gespeichert..."
        }).then(event => {
            load();
            setCurrentEvent(event);
        });
    }

    return <Site title="Termine bearbeiten">
        <div className="mt-8 grid md:grid-cols-2 gap-6 md:overflow-y-auto md:flex-[1_0_0]">
            <div
                className="flex flex-col overflow-y-scroll p-4 rounded-lg max-h-96 md:max-h-[none]">
                {records.map(([date, events]) => <div key={date}>
                    <EventDate date={new Date(date)}/>
                    {events.filter(event => event.calendar === 'inzersdorf').map(event =>
                        <div
                            key={event.id} className={`${currentEvent?.id === event.id ? ' border-black/10' : 'border-white'} border-2 cursor-pointer hover:bg-black/5 px-2 rounded-lg`}
                            onClick={() => setCurrentEvent(event)}
                        >
                            <Event event={event}/>
                        </div>
                    )}
                </div>)}
            </div>
            {currentEvent && <div className="flex flex-col p-8 bg-black/5 rounded-lg">
                <div className="text-3xl font-bold my-2">{currentEvent?.summary}</div>
                <div className="text-lg my-1"><EventDateText
                    date={new Date(currentEvent?.date!)}/>, {new Date(currentEvent?.start.dateTime!).toLocaleTimeString()}</div>
                <div className="text-lg my-1">
                    <SanitizeHTML html={currentEvent?.description}/>
                </div>
                <div className="flex-grow flex flex-col justify-end">
                    <div>Musikal. Gestaltung</div>
                    <div className="flex gap-2">
                        <input className="text-lg px-2 py-1 grow rounded-lg" value={music}
                               onChange={({target}) => setMusic(target.value)}></input>
                        <button className="bg-black/5 hover:bg-black/10 px-4 rounded-lg" onClick={saveMusic}>Speichern
                        </button>
                    </div>
                </div>
            </div>}
        </div>
    </Site>
}