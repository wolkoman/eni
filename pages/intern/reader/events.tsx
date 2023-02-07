import React, {useState} from 'react';
import {groupEventsByDate} from "../../../util/use-calendar-store";
import {CalendarEvent, CalendarGroup} from "../../../util/calendar-types";
import {getLiturgyData, Liturgy, LiturgyData} from "../../api/liturgy";
import {fetchJson} from "../../../util/fetch-util";
import {Collections} from "cockpit-sdk";
import {ReaderData, ReaderRole, ReaderStatus, roleToString} from "../../../util/reader";
import {useAuthenticatedReaderStore} from "../../../util/use-reader-store";
import {ReaderSite} from "./index";
import {compareLiturgy} from "./my";
import {clickable, unibox} from "../../../components/calendar/ComingUp";

function PersonSelector(props: { persons: Collections['person'][], person?: string, onChange: (id: string | null) => any }) {

    //const {readerCount} = useAuthenticatedReaderStore();

    return <div>
        <div className="flex gap-2">
            <select value={props.person ?? ""} onChange={({target}) => props.onChange(target.value ? target.value : null)}>
                <option value="">niemand</option>
                {props.persons
                    //.sort((a,b) => a.count - b.count)
                    .map(({name, _id: id}) => <option key={id} value={id}>{name}</option>)}
            </select>
        </div>
    </div>;
}

function LiturgyStatus(props: {status: ReaderStatus}) {
    const statusColors = {assigned: 'bg-blue-500', informed: 'bg-green-600', cancelled: 'bg-red-600'};
    return <div className={`w-3 h-3 my-1.5 rounded ${statusColors[props.status]}`}/>;
}

function LiturgyEvent(props: {
    setActive: () => void,
    event: CalendarEvent,
    active: boolean,
    liturgies: Liturgy[],
    readers: Collections["person"][],
    communionMinisters: Collections["person"][],
    readerData: ReaderData[string],
    selectLiturgy: (liturgy: string) => any,
    selectPerson: (role: ReaderRole, userId: string | null) => any,
}) {
    const activeLiturgy = props.liturgies.find(liturgy => liturgy.name === props.readerData?.liturgy);
    return <div
        className={`rounded-lg overflow-hidden ${!activeLiturgy && "print:hidden"} ${props.active ? unibox : clickable}`}>
        <div
            className={`flex gap-1 px-3 py-0.5 w-full print:p-0 print:hidden`}
            onClick={props.setActive}>
            {(["reading1", "reading2", "communionMinister1", "communionMinister2"] as ReaderRole[]).map(role =>
                <LiturgyStatus status={props.readerData?.[role]?.status}/>
            )}
            <div className="w-12">
                {new Date(props.event.start.dateTime).toLocaleTimeString("de-AT").substring(0, 5)}
            </div>
            <div>{props.event.summary}</div>
        </div>
        <div className={`p-3 grid lg:grid-cols-2 gap-3 print:p-0 ${!props.active && 'hidden print:grid print:grid-cols-2 print:gap-1'}`}>
            <>
                <div className="print:hidden">Liturgien:</div>
                <div className="print:hidden flex flex-col">
                    {props.liturgies
                        .sort(compareLiturgy)
                        .map(liturgy => ({liturgy, active: activeLiturgy?.name === liturgy.name}))
                        .map(({liturgy, active}) => <div
                            key={liturgy.name}
                            onClick={!active ? () => props.selectLiturgy(liturgy.name) : undefined}
                            className={`px-2 py-0.5 rounded ${active ? 'font-bold' : 'cursor-pointer hover:bg-black/5 print:hidden'}`}
                        >
                            {liturgy.name} {liturgy.rank && `[${liturgy.rank}]`}
                        </div>)}
                </div>
            </>
            {(["reading1", "reading2"] as const).filter(role => activeLiturgy?.[role]).map((role) =>
                <>
                    <div>{roleToString(role)} ({activeLiturgy?.[role]}):</div>
                    <PersonSelector
                        persons={props.readers}
                        person={props.readerData?.[role]?.id}
                        onChange={personId => props.selectPerson(role, personId)}/>
                </>)}
            {(["communionMinister1", "communionMinister2"] as const).map(role =>
                <>
                    <div>{roleToString(role)}:</div>
                    <PersonSelector
                        persons={props.communionMinisters}
                        person={props.readerData?.[role]?.id}
                        onChange={personId => props.selectPerson(role, personId)}/>
                </>)}
            {props.readerData?.cancelledBy && <>
                <div>Abgesagt:</div>
                <div className="flex flex-col">
                    {props.readerData.cancelledBy.map(id =>
                        <div key={id}>{props.readers.find(reader => reader._id === id)?.name}</div>)}
                </div>
            </>}

        </div>

    </div>;
}

export default function Index(props: { liturgy: LiturgyData }) {

    const [currentEvent, setCurrentEvent] = useState("");
    const [showOnlySpecial, setShowOnlySpecial] = useState(true);
    const {readers, communionMinisters, readerData, setReaderData, events, ...reader} = useAuthenticatedReaderStore();

    async function selectLiturgy(eventId: string, liturgy: string) {
        const date = events.find(event => event.id === eventId)!.date;
        fetchJson("/api/reader/save", {json: {[eventId]: {liturgy, date}}}, {
            pending: "Liturgie wird gespeichert",
            error: "Liturgie wurde nicht gespeichert",
            success: "Liturgie wurde gespeichert"
        }).then(() => setReaderData({[eventId]: {...readerData[eventId], liturgy}}));
    }

    async function selectPerson(eventId: string, role: ReaderRole, userId: string | null) {
        const userName = readers.find(reader => reader._id === userId)?.name ?? 'Unbekannt';
        const roleData = userId !== null ? {id: userId, name: userName, status: "assigned"} : null;
        fetchJson("/api/reader/save", {
            json: {[eventId]: {[role]: roleData}}
        }, {
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
        <div className="flex flex-col gap-2">
            <div className="print:hidden">
                <input
                    type="checkbox"
                    defaultChecked={showOnlySpecial}
                    onChange={({target}) => setShowOnlySpecial(target.checked)}/>{" "}
                Nur Feste anzeigen
            </div>
            {liturgyEvents.map(([date, events]) => <div className="flex flex-col lg:flex-row" key={date}>
                <div className={`w-24 flex-shrink-0 ${new Date(date).getDay() ? '' : 'font-bold'}`}>
                    {new Date(date).toLocaleDateString()}
                </div>
                <div className="flex flex-col gap-2 flex-grow">
                    {events.map(event =>
                        <LiturgyEvent
                            readers={readers}
                            communionMinisters={communionMinisters}
                            key={event.id} event={event}
                            readerData={readerData[event.id]}
                            setActive={() => setCurrentEvent(event.id)}
                            active={currentEvent === event.id} liturgies={props.liturgy[event.date]}
                            selectPerson={(...args) => selectPerson(event.id, ...args)}
                            selectLiturgy={(...args) => selectLiturgy(event.id, ...args)}
                        />
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