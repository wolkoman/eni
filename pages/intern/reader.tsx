import React, {useEffect, useState} from 'react';
import Site from '../../components/Site';
import {groupEventsByDate, useCalendarStore} from "../../util/use-calendar-store";
import {useUserStore} from "../../util/use-user-store";
import {CalendarName, getCalendarInfo} from "../../util/calendar-info";
import {CalendarEvent, CalendarGroup} from "../../util/calendar-types";
import {getLiturgyData, Liturgy, LiturgyData} from "../api/liturgy";
import {fetchJson} from "../../util/fetch-util";
import {Collections} from "cockpit-sdk";
import Button from "../../components/Button";
import {getTasksForPerson, getTasksFromReaderData, getUninformedTasks, ReaderData, ReaderTask} from "../../util/reader";

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
    setActive: () => void,
    event: CalendarEvent,
    active: boolean,
    liturgies: Liturgy[],
    readers: Collections["person"][],
    readerData: ReaderData[string],
    selectLiturgy: (liturgy: string) => any,
    selectPerson: (role: 'reader1' | 'reader2', userId: string) => any
}) {
    const activeLiturgy = props.liturgies.find(liturgy => liturgy.name === props.readerData?.liturgy);
    return <div className="bg-black/5 rounded-lg  overflow-hidden">
        <div
            className={`flex gap-2  px-3 py-0.5 w-full ${!props.active ? 'hover:bg-black/10 cursor-pointer ' : "text-lg font-bold"}`}
            onClick={props.setActive}>
            <div className="w-12">
                {new Date(props.event.start.dateTime).toLocaleTimeString().substring(0, 5)}
            </div>
            <div>{props.event.summary}</div>
        </div>
        {props.active && <div className="p-3 flex flex-col gap-3">
            <div className="flex flex-col lg:flex-row">
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
                <div className="flex flex-col lg:flex-row">
                    <div className="w-52">1. Lesung ({activeLiturgy.reading1}):</div>
                    <PersonSelector
                        persons={props.readers}
                        person={props.readerData?.reader1?.id}
                        onChange={personId => props.selectPerson('reader1', personId)}/>
                </div>
                {activeLiturgy.reading2 && <div className="flex flex-col lg:flex-row">
                    <div className="w-52">2. Lesung ({activeLiturgy.reading2}):</div>
                    <PersonSelector
                        persons={props.readers}
                        person={props.readerData?.reader2?.id}
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
    const [view, setView] = useState<'events' | 'persons'>('events');
    const [selectedParish, setSelectedParish] = useState(CalendarName.EMMAUS);
    const [currentEvent, setCurrentEvent] = useState("");
    const [showOnlySpecial, setShowOnlySpecial] = useState(true);
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
        const userName = data.readers.find(reader => reader._id === userId)?.name ?? 'Unbekannt';
        fetchJson("/api/reader/save", {
            jwt,
            json: {[eventId]: {[role]: {id: userId, name: userName, status: "assigned"}}}
        }, {
            pending: "Person wird gespeichert",
            error: "Person wurde nicht gespeichert",
            success: "Person wurde gespeichert"
        }).then(() => setData(data => ({
            ...data,
            readerData: {
                ...data.readerData,
                [eventId]: {...data.readerData[eventId], [role]: {id: userId, name: userName, status: "assigned"}}
            }
        })))
    }

    const parishReaders = data.readers.filter(person => person.parish === selectedParish || person.parish === "all");
    const tasks = getTasksFromReaderData(data.readerData, id => events.find(event => event.id === id)!);
    const liturgyEvents = Object.entries(groupEventsByDate(events
        .filter(event => event.groups.includes(CalendarGroup.Messe) || event.groups.includes(CalendarGroup.Gottesdienst))
        .filter(event => event.calendar === selectedParish)
        .filter(event => !showOnlySpecial || props.liturgy[event.date]?.some(liturgy => ["F", "H"].includes(liturgy.rank)) || new Date(event.date).getDay() === 0)
    ));


    async function informPersonPerMail(tasks: ReaderTask<CalendarEvent>[]) {
        await fetchJson("/api/reader/mail", {jwt, json: {eventIds: tasks.map(job => job.event.id), personId: tasks[0].data.userId}}, {
            pending: "Mails wird gesendet",
            error: "Mail wurde nicht gesendet",
            success: "Mail wurde gesendet"
        })
        await informPersonPersonally(tasks);
    }

    function informPersonPersonally(tasks: ReaderTask<CalendarEvent>[]) {
        let changes = (jobData: any) => Object.fromEntries(tasks.map(job => [job.event.id, {
            ...jobData[job.event.id],
            [job.data.role]: {
                id: job.data.userId,
                name: data.readers.find(reader => reader._id === job.data.userId)?.name,
                status: 'informed'
            }
        }]));
        return fetchJson("/api/reader/save", {jwt, json: changes({})}, {
            pending: "Status wird gespeichert",
            error: "Status wurde nicht gespeichert",
            success: "Status wurde gespeichert"
        }).then(() => setData(data => ({
            ...data,
            readerData: {
                ...data.readerData,
                ...changes(data.readerData)
            }
        })))
    }


    return <Site title="Lektor:innen">
        <datalist id="persons">
            {parishReaders.map(person => <option key={person._id}>{person.name}</option>)}
        </datalist>
        <div className="py-6 flex flex-col gap-2">
            <div className="flex gap-2">
                {[CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT]
                    .map(parish => getCalendarInfo(parish))
                    .map(p => <div
                        className={(selectedParish === p.id ? p.className : 'bg-black/5') + " px-3 py-1 rounded-lg cursor-pointer"}
                        onClick={() => setSelectedParish(p.id)}>{p.shortName}</div>)}
            </div>
            <div className="flex gap-2">
                <div
                    className={(view === 'persons' ? 'bg-black/10' : 'bg-black/5') + " px-3 py-1 rounded-lg cursor-pointer"}
                    onClick={() => setView('persons')}>Personen
                </div>
                <div
                    className={(view === 'events' ? 'bg-black/10' : 'bg-black/5') + " px-3 py-1 rounded-lg cursor-pointer"}
                    onClick={() => setView('events')}>Termine
                </div>
            </div>
        </div>
        {calendarLoading || calendarError ? <>Termine werden geladen...</> : <>
            {view === 'events' ? <div className="flex flex-col gap-2">
                <div>
                    <input
                        type="checkbox"
                        defaultChecked={showOnlySpecial}
                        onChange={({target}) => setShowOnlySpecial(target.checked)}/>{" "}
                    Nur Feste anzeigen
                </div>
                {liturgyEvents.map(([date, events]) => <div className="flex flex-col lg:flex-row">
                    <div className={`w-32 flex-shrink-0 ${new Date(date).getDay() ? '' : 'font-bold'}`}>
                        {new Date(date).toLocaleDateString()}
                    </div>
                    <div className="flex flex-col gap-2 flex-grow">
                        {events.map(event =>
                            <LiturgyEvent
                                key={event.id} event={event} readers={parishReaders}
                                readerData={data.readerData[event.id]}
                                setActive={() => setCurrentEvent(event.id)}
                                active={currentEvent === event.id} liturgies={props.liturgy[event.date]}
                                selectPerson={(...args) => selectPerson(event.id, ...args)}
                                selectLiturgy={(...args) => selectLiturgy(event.id, ...args)}/>
                        )}</div>
                </div>)}
            </div> : <div className="flex flex-col gap-3">
                {parishReaders
                    .map(person => ({person, tasks: getTasksForPerson(tasks, person._id)}))
                    .map(({person, tasks}) => ({person, tasks, uninformedTasks: getUninformedTasks(tasks) }))
                    .map(({person, tasks, uninformedTasks}) =>
                        <div key={person._id} className="flex flex-col gap-2 px-4 py-2 rounded-lg bg-black/5">
                            <div className="font-bold">{person.name}</div>
                            <div>
                                {tasks.map(({event, data}) =>
                                    <div key={event.id + data.role} className="flex gap-1 items-center">
                                        <div className={`w-3 h-3 grow-0 rounded-full ${{assigned: "bg-[#f90]", informed: "bg-[#090]"}[data.status]}`}/>
                                        <div>
                                            {new Date(event.date).toLocaleDateString()} {new Date(event.start.dateTime).toLocaleTimeString().substring(0, 5)}
                                        </div>
                                        <div>
                                            {event.summary}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {uninformedTasks.length > 0 && <div className="flex justify-end gap-1">
                                <Button label="Persönlich informieren" onClick={() => informPersonPersonally(uninformedTasks)}/>
                                {person.email && <Button label="Per Mail informieren" onClick={() => informPersonPerMail(uninformedTasks)}/>}
                            </div>}
                        </div>)}
            </div>}
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