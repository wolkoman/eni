"use client"
import React, {useState} from 'react';
import {toast} from "react-toastify";
import {LiturgyData} from "../../../../pages/api/liturgy";
import {useReaderStore} from "@/store/ReaderStore";
import {CalendarGroup} from "@/domain/events/CalendarGroup";
import {ReaderSite} from "../IndexPage";
import {ReaderRole} from "@/domain/service/Service";
import {fetchJson} from "@/app/(shared)/FetchJson";
import {LiturgyEvent} from "./LiturgyEvent";
import {resolveAvailableLiturgies} from "./resolveAvailableLiturgies";
import {Links} from "@/app/(shared)/Links";
import {groupEventsByDate} from "@/domain/events/CalendarGrouper";


export default function EventsPage(props: { liturgy: LiturgyData }) {

    const [currentEvent, setCurrentEvent] = useState("");
    const [showOnlySpecial, setShowOnlySpecial] = useState(true);
    const {readers, communionMinisters, readerData, setReaderData, events, ...reader} = useReaderStore(state => state);

    async function selectLiturgy(eventId: string, liturgy: string) {
        const date = events.find(event => event.id === eventId)!.date;
        toast.promise(fetchJson(Links.ApiReaderSave, {json: {[eventId]: {liturgy, date}}}), {
            pending: "Liturgie wird gespeichert",
            error: "Liturgie wurde nicht gespeichert",
            success: "Liturgie wurde gespeichert"
        }).then(() => setReaderData({[eventId]: {...readerData[eventId], liturgy}}));
    }

    async function selectPerson(eventId: string, role: ReaderRole, userId: string | null) {
        const userName = [...readers, ...communionMinisters].find(reader => reader._id === userId)?.name ?? 'Unbekannt';
        const roleData = userId !== null ? {id: userId, name: userName, status: "assigned"} : null;
        toast.promise(fetchJson(Links.ApiReaderSave, {
            json: {[eventId]: {[role]: roleData}}
        }), {
            pending: "Person wird gespeichert",
            error: "Person wurde nicht gespeichert",
            success: "Person wurde gespeichert"
        }).then(() => setReaderData({[eventId]: {...readerData[eventId], [role]: roleData}}))
    }

    const liturgyEvents = Object.entries(groupEventsByDate(events
        .filter(event => event.groups.includes(CalendarGroup.Messe) || event.groups.includes(CalendarGroup.Gottesdienst))
        .filter(event => event.calendar === reader.parish)
        .filter(event =>
            !showOnlySpecial
            || props.liturgy[event.date]?.some(liturgy => ["F", "H"].includes(liturgy.rank))
            || new Date(event.date).getDay() === 0
        )
    ));

    return <ReaderSite>
        <div className="flex flex-col">
            <div className="print:hidden mb-4 flex items-center gap-2">
                <input
                    type="checkbox"
                    defaultChecked={showOnlySpecial}
                    onChange={({target}) => setShowOnlySpecial(target.checked)}/>
                Nur Feste anzeigen
            </div>
            <div className="border-t border-black/20">
                {liturgyEvents.map(([date, events]) => <div
                    className="flex flex-col lg:flex-row border-b border-black/20" key={date}>
                    <div className={`w-24 flex-shrink-0 ${new Date(date).getDay() ? '' : 'font-bold'} py-1`}>
                        {new Date(date).toLocaleDateString("de-AT")}
                    </div>
                    <div className="flex flex-col flex-grow">
                        {events.map(event =>
                            <LiturgyEvent
                                readers={readers}
                                communionMinisters={communionMinisters}
                                key={event.id} event={event}
                                readerData={readerData[event.id]}
                                setActive={() => setCurrentEvent(event.id)}
                                active={currentEvent === event.id}
                                liturgies={resolveAvailableLiturgies(props.liturgy, event)}
                                selectPerson={(...args) => selectPerson(event.id, ...args)}
                                selectLiturgy={(...args) => selectLiturgy(event.id, ...args)}
                            />
                        )}</div>
                </div>)}
            </div>
        </div>
    </ReaderSite>
}
