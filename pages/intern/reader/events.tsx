import React, {useState} from 'react';
import Site from '../../../components/Site';
import {useAuthenticatedCalendarStore} from "../../../util/use-calendar-store";
import {useUserStore} from "../../../util/use-user-store";
import {CalendarName, getCalendarInfo} from "../../../util/calendar-info";
import {CalendarEvent, CalendarGroup} from "../../../util/calendar-types";
import {getLiturgyData, Liturgy, LiturgyData} from "../../api/liturgy";
import {fetchJson} from "../../../util/fetch-util";
import {Collections} from "cockpit-sdk";
import Button from "../../../components/Button";
import {
    getTasksForPerson,
    getTasksFromReaderData,
    getUninformedTasks,
    ReaderData,
    ReaderTask
} from "../../../util/reader";
import {useAuthenticatedReaderStore} from "../../../util/use-reader-store";
import {ReaderSite} from "./index";
import {compareLiturgy} from "./my";
import {groupEventsByDate} from "../../../util/group-events-by-group-and-date";

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
    selectPerson: (role: 'reading1' | 'reading2', userId: string) => any
}) {
    const activeLiturgy = props.liturgies.find(liturgy => liturgy.name === props.readerData?.liturgy);
    return <div className="bg-black/5 rounded-lg  overflow-hidden">
        <div
            className={`flex gap-2  px-3 py-0.5 w-full ${!props.active ? 'hover:bg-black/10 cursor-pointer ' : "text-lg font-bold"}`}
            onClick={props.setActive}>
            <div className={`w-3 h-3 my-1.5 rounded ${{assigned: 'bg-blue-500', informed: 'bg-green-600', cancelled: 'bg-red-600'}[props.readerData?.reading1?.status]}`} />
            <div className={`w-3 h-3 my-1.5 rounded ${{assigned: 'bg-blue-500', informed: 'bg-green-600', cancelled: 'bg-red-600'}[props.readerData?.reading2?.status]}`} />
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
                        person={props.readerData?.reading1?.id}
                        onChange={personId => props.selectPerson('reading1', personId)}/>
                </div>
                {activeLiturgy.reading2 && <div className="flex flex-col lg:flex-row">
                    <div className="w-52">2. Lesung ({activeLiturgy.reading2}):</div>
                    <PersonSelector
                        persons={props.readers}
                        person={props.readerData?.reading2?.id}
                        onChange={personId => props.selectPerson('reading2', personId)}/>
                </div>}
            </>}

        </div>}

    </div>;
}

export default function Index(props: { liturgy: LiturgyData }) {

    const [currentEvent, setCurrentEvent] = useState("");
    const [showOnlySpecial, setShowOnlySpecial] = useState(true);
    const {readers, readerData, setReaderData, events, ...reader} = useAuthenticatedReaderStore();
    const jwt = useUserStore(state => state.jwt);

    async function selectLiturgy(eventId: string, liturgy: string) {
        fetchJson("/api/reader/save", {jwt, json: {[eventId]: {liturgy}}}, {
            pending: "Liturgie wird gespeichert",
            error: "Liturgie wurde nicht gespeichert",
            success: "Liturgie wurde gespeichert"
        }).then(() => setReaderData({[eventId]: {...readerData[eventId], liturgy}}));
    }

    async function selectPerson(eventId: string, role: 'reading1' | 'reading2', userId: string) {
        const userName = readers.find(reader => reader._id === userId)?.name ?? 'Unbekannt';
        fetchJson("/api/reader/save", {
            jwt,
            json: {[eventId]: {[role]: {id: userId, name: userName, status: "assigned"}}}
        }, {
            pending: "Person wird gespeichert",
            error: "Person wurde nicht gespeichert",
            success: "Person wurde gespeichert"
        }).then(() => setReaderData({
            [eventId]: {...readerData[eventId], [role]: {id: userId, name: userName, status: "assigned"}}
        }))
    }

    const parishReaders = readers.filter(person => person.parish === reader.parish || person.parish === "all");
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
        <datalist id="persons">
            {parishReaders.map(person => <option key={person._id}>{person.name}</option>)}
        </datalist>
        <div className="flex flex-col gap-2">
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
                            readerData={readerData[event.id]}
                            setActive={() => setCurrentEvent(event.id)}
                            active={currentEvent === event.id} liturgies={props.liturgy[event.date]}
                            selectPerson={(...args) => selectPerson(event.id, ...args)}
                            selectLiturgy={(...args) => selectLiturgy(event.id, ...args)}/>
                    )}</div>
            </div>)}
        </div>
    </ReaderSite>
}

export async function getStaticProps() {
    return {
        props: {
            liturgy: await getLiturgyData(),
        },
        revalidate: 3600 * 24,
    }
}