import {CalendarEvent} from "../../../(domain)/events/EventMapper";
import {Liturgy} from "../../../../pages/api/liturgy";
import {Collections} from "cockpit-sdk";
import {ReaderData, ReaderRole, roleToString} from "../../../(domain)/service/Service";
import {Clickable} from "../../../(shared)/Clickable";
import {LiturgyStatus} from "./LiturgyStatus";
import {compareLiturgy} from "../my/MyPage";
import {PersonSelector} from "./PersonSelector";
import React from "react";

export function LiturgyEvent(props: {
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
    return <Clickable
        disabled={props.active}
        className={`rounded-lg overflow-hidden ${!activeLiturgy && "print:hidden"}`}>
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
        <div
            className={`p-3 grid lg:grid-cols-2 gap-3 print:p-0 ${!props.active && 'hidden print:grid print:grid-cols-2 print:gap-1'}`}>
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

    </Clickable>;
}
