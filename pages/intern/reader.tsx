import React, {useEffect, useState} from 'react';
import Site from '../../components/Site';
import {groupEventsByDate, useCalendarStore} from "../../util/use-calendar-store";
import {useUserStore} from "../../util/use-user-store";
import {CalendarName, getCalendarInfo} from "../../util/calendar-info";
import {CalendarEvent, CalendarGroup} from "../../util/calendar-types";
import {getLiturgyData, Liturgy, LiturgyData} from "../api/liturgy";
import {fetchJson} from "../../util/fetch-util";
import {ReaderData} from "../api/reader";
import {Collections} from "cockpit-sdk";

export function compareLiturgy(a: Liturgy, b: Liturgy) {
    const order = ["H", "F", "G", "", "g"];
    return order.indexOf(a.rank) - order.indexOf(b.rank);
}

function PersonSelector(props: { persons: Collections['person'][], person: string, onChange: (id: string) => any }) {
    function onChange(name: string) {
        const id = props.persons.find(v => v.name === name)?._id;
        if (!id) return;
        props.onChange(id);
    }

    return <input
        list="persons" className="px-3 py-1 rounded"
        defaultValue={props.persons.find(p => p._id === props.person)?.name}
        onChange={({target}) => onChange(target.value)}
    />;
}

function LiturgyEvent(props: {
    onClick: () => void,
    event: CalendarEvent,
    active: boolean,
    liturgies: Liturgy[],
    data: { readerData: ReaderData; readers: Collections["person"][] },
    selectLiturgy: (liturgy: string) => any,
    selectPerson: (role: 'reader1' | 'reader2', userId: string) => any
}) {
    const activeLiturgy = props.liturgies.find(liturgy => liturgy.name === props.data.readerData[props.event.id]?.liturgy);
    return <div className="bg-black/5 rounded-lg  overflow-hidden">
        <div
            className={`flex gap-2  px-3 py-0.5 w-full ${!props.active ? 'hover:bg-black/10 cursor-pointer ' : "text-lg font-bold"}`}
            onClick={props.onClick}>
            <div className="w-12">
                {new Date(props.event.start.dateTime).toLocaleTimeString().substring(0, 5)}
            </div>
            <div>{props.event.summary}</div>
        </div>
        {props.active && <div className="p-3 flex flex-col gap-3">
            <div className="flex">
                <div className="w-32">Liturgien:</div>
                <div className="flex flex-col">
                    {props.liturgies
                        .sort(compareLiturgy)
                        .map(liturgy => ({liturgy, active: activeLiturgy?.name === liturgy.name}))
                        .map(({liturgy, active}) => <div
                            key={liturgy.name}
                            onClick={!active ? () => props.selectLiturgy(liturgy.name) : undefined}
                            className={`px-2 py-0.5 rounded ${active ? 'font-bold' : ' cursor-pointer hover:bg-black/5'}`}
                        >
                            {liturgy.name} {liturgy.rank && `[${liturgy.rank}]`}
                        </div>)}
                </div>
            </div>
                {activeLiturgy && <>
                    <div className="flex">
                        <div className="w-52">1. Lesung ({activeLiturgy.reading1}):</div>
                        <PersonSelector
                            persons={props.data.readers}
                            person={props.data.readerData[props.event.id]?.reader1}
                            onChange={personId => props.selectPerson('reader1', personId)}/>
                    </div>
                    {activeLiturgy.reading2 && <div className="flex">
                        <div className="w-52">2. Lesung ({activeLiturgy.reading2}):</div>
                        <PersonSelector
                            persons={props.data.readers}
                            person={props.data.readerData[props.event.id]?.reader2}
                            onChange={personId => props.selectPerson('reader2', personId)}/>
                    </div>}
                </>}

        </div>}

    </div>;
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

    let liturgyEvents = Object.entries(groupEventsByDate(events
        .filter(event => event.groups.includes(CalendarGroup.Messe) || event.groups.includes(CalendarGroup.Gottesdienst))
        .filter(event => event.calendar === selectedParish))
    );
    return <Site title="Lektor:innen">
        <datalist id="persons">
            {data.readers.map(person => <option key={person._id}>{person.name}</option>)}
        </datalist>
        <div className="flex gap-2 py-6">
            {[CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT]
                .map(parish => getCalendarInfo(parish))
                .map(p => <div
                    className={(selectedParish === p.id ? p.className : 'bg-black/5') + " px-3 py-1 rounded-lg cursor-pointer"}
                    onClick={() => setSelectedParish(p.id)}>{p.shortName}</div>)}
        </div>
        {calendarLoading || calendarError ? <>Termine werden geladen...</> : <>
            <div className="flex flex-col gap-2">
                {liturgyEvents.map(([date, events]) => <div className="flex">
                    <div className={`w-32 ${new Date(date).getDay() ? '' : 'font-bold'}`}>
                        {new Date(date).toLocaleDateString()}
                    </div>
                    <div className="flex flex-col gap-2 flex-grow">
                        {events.map(event =>
                            <LiturgyEvent
                                key={event.id} event={event} data={data}
                                onClick={() => setCurrentEvent(event.id)}
                                active={currentEvent === event.id} liturgies={props.liturgy[event.date]}
                                selectPerson={(...args) => selectPerson(event.id, ...args)}
                                selectLiturgy={(...args) => selectLiturgy(event.id, ...args)}/>
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