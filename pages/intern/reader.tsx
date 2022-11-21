import React, {useEffect, useState} from 'react';
import Site from '../../components/Site';
import {groupEventsByDate, useCalendarStore} from "../../util/use-calendar-store";
import {useUserStore} from "../../util/use-user-store";
import {CalendarName, getCalendarInfo} from "../../util/calendar-info";
import {CalendarGroup} from "../../util/calendar-types";
import {getLiturgyData, Liturgy, LiturgyData} from "../api/liturgy";
import {fetchJson} from "../../util/fetch-util";
import {ReaderData} from "../api/reader";
import {Collections} from "cockpit-sdk";

export function compareLiturgy(a: Liturgy, b: Liturgy) {
    const order = ["H", "F", "G", "", "g"];
    return order.indexOf(a.rank) - order.indexOf(b.rank);
}

function PersonSelector(props: { persons: Collections['person'][], person: string, onChange: (id: string) => any }) {
    return <>
        <select defaultValue={props.person} onChange={({target}) => props.onChange(target.value)}>
            <option value="">-</option>
            {props.persons.map(person => <option key={person._id} value={person._id}>{person.name}</option>)}
        </select>
    </>;
}

export default function Reader(props: { liturgy: LiturgyData }) {

    const [data, setData] = useState<{ readerData: ReaderData, readers: Collections['person'][], }>({
        readers: [],
        readerData: {}
    });
    const [selectedParish, setSelectedParish] = useState(CalendarName.ALL);
    const [currentEvent, setCurrentEvent] = useState("");
    const [events, calendarLoad, calendarLoading, calendarError] = useCalendarStore(state => [state.items, state.load, state.loading, state.error]);
    const [jwt] = useUserStore(state => [state.jwt])
    useEffect(() => {
        if (jwt) {
            calendarLoad(jwt);
            fetchJson("/api/reader", {jwt}).then(data => setData(data));
        }
    }, [calendarLoad, jwt]);


    async function selectLiturgy(eventId: string, liturgy: string) {
        fetchJson("/api/reader/save", {jwt, json: {[eventId]: {liturgy}}}, {
            pending: "Liturgie wird gespeichert",
            error: "Liturgie wurde nicht gespeichert",
            success: "Liturgie wurde gespeichert"
        }).then(() => setData(data => ({
            ...data,
            readerData: {...data.readerData, [eventId]: {...data.readerData[eventId], liturgy}}
        })))
    }

    async function selectPerson(eventId: string, role: 'reader1' | 'reader2', userId: string) {
        fetchJson("/api/reader/save", {jwt, json: {[eventId]: {[role]: userId}}}, {
            pending: "Person wird gespeichert",
            error: "Person wurde nicht gespeichert",
            success: "Person wurde gespeichert"
        }).then(() => setData(data => ({
            ...data,
            readerData: {...data.readerData, [eventId]: {...data.readerData[eventId], [role]: userId}}
        })))
    }

    return <Site title="Lektor:innen">
        <div className="flex gap-2 py-6">
            {[CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT]
                .map(parish => getCalendarInfo(parish))
                .map(p => <div
                    className={(selectedParish === p.id ? p.className : 'bg-black/10') + " px-3 py-1 rounded cursor-pointer"}
                    onClick={() => setSelectedParish(p.id)}>{p.shortName}</div>)}
        </div>
        {calendarLoading || calendarError ? <>Termine werden geladen...</> : <>
            <div className="flex flex-col gap-2">
                {Object.entries(groupEventsByDate(events
                    .filter(event => event.groups.includes(CalendarGroup.Messe) || event.groups.includes(CalendarGroup.Gottesdienst))
                    .filter(event => event.calendar === selectedParish))
                )
                    .map(([date, events]) => <div className="flex">
                        <div
                            className={`w-32 ${new Date(date).getDay() ? '' : 'font-bold'}`}>{new Date(date).toLocaleDateString()}</div>
                        <div className="flex flex-col gap-2 flex-grow">{events.map(event =>
                            <div className="bg-black/5 rounded">
                                <div key={event.id}
                                     className="flex gap-2  hover:bg-black/10 cursor-pointer px-3 py-0.5 w-full overflow-hidden"
                                     onClick={() => setCurrentEvent(event.id)}>
                                    <div
                                        className="w-12">{new Date(event.start.dateTime).toLocaleTimeString().substring(0, 5)}</div>
                                    <div>{event.summary}</div>
                                </div>
                                {currentEvent === event.id && <div className="p-3 flex flex-col gap-3">
                                    <div className="flex">
                                        {props.liturgy[event.date]
                                            .sort(compareLiturgy)
                                            .map((liturgy, i, all) =>
                                                <div key={liturgy.name}
                                                     onClick={() => selectLiturgy(event.id, liturgy.name)}
                                                     className={`flex flex-col items-center p-3 max-w-[250px] text-center hover:bg-black/5 cursor-pointer rounded ${data.readerData[event.id]?.liturgy === liturgy.name && 'border border-black/10'}`}
                                                >
                                                    <div>{liturgy.name} {liturgy.rank && `[${liturgy.rank}]`}</div>
                                                </div>)}
                                    </div>
                                    <div>
                                        <div>1. Lesung: <PersonSelector
                                            persons={data.readers}
                                            person={data.readerData[event.id]?.reader1}
                                            onChange={userId => selectPerson(event.id, 'reader1', userId)}/>
                                        </div>
                                        <div>2. Lesung: <PersonSelector
                                            persons={data.readers}
                                            person={data.readerData[event.id]?.reader2}
                                            onChange={userId => selectPerson(event.id, 'reader2', userId)}/>
                                        </div>
                                    </div>
                                </div>}

                            </div>
                        )}</div>
                    </div>)}
            </div>
        </>}
    </Site>
}

export async function getStaticProps() {
    return {
        props: {
            liturgy: await getLiturgyData(),
        },
        revalidate: 3600 * 24,
    }
}