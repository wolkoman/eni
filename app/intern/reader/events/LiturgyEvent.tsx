import {CalendarEvent} from "../../../(domain)/events/EventMapper";
import {Liturgy} from "../../../../pages/api/liturgy";
import {Collections} from "cockpit-sdk";
import {ReaderData, ReaderRole, roleToString} from "../../../(domain)/service/Service";
import {LiturgyStatus} from "@/app/intern/reader/LiturgyStatus";
import {compareLiturgy} from "@/app/intern/reader/my/MyPage";
import {PersonSelector} from "@/app/intern/reader/events/PersonSelector";

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
    return <div
        onClick={props.setActive}
        className={`${!activeLiturgy && "print:hidden"} ${!props.active && "cursor-pointer"} flex gap-2 ${props.active && "bg-white"} p-1`}
    >
        <div className="flex gap-1">
            {(["reading1", "reading2", "communionMinister1", "communionMinister2"] as ReaderRole[]).map(role =>
                <LiturgyStatus status={props.readerData?.[role]?.status}/>
            )}
        </div>
        <div>
            <div className="flex gap-1 px-3 py-0.5 w-full print:p-0 print:hidden">
                <div className="w-12">
                    {new Date(props.event.start.dateTime).toLocaleTimeString("de-AT").substring(0, 5)}
                </div>
                <div>{props.event.summary} {props.event.visibility === "private" && "(Vertraulich)"}</div>
            </div>
            <div
                className={`p-3 inline-grid lg:grid-cols-[auto_auto] gap-x-3 gap-y-1 print:p-0 ${!props.active && 'hidden print:grid print:gap-1'}`}>
                <>
                    <div className="print:hidden">Liturgien:</div>
                    <div className="print:hidden flex flex-wrap">
                        {props.liturgies
                            .sort(compareLiturgy)
                            .map(liturgy => ({liturgy, active: activeLiturgy?.name === liturgy.name}))
                            .map(({liturgy, active}) => <div
                                key={liturgy.name}
                                onClick={!active ? () => props.selectLiturgy(liturgy.name) : undefined}
                                className={`px-2 py-0.5 rounded ${active ? 'border border-black/20 rounded' : 'cursor-pointer hover:bg-black/5 print:hidden'}`}
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
                {/*(["communionMinister1", "communionMinister2"] as const).map(role =>
                    <>
                        <div>{roleToString(role)}:</div>
                        <PersonSelector
                            persons={props.communionMinisters}
                            person={props.readerData?.[role]?.id}
                            onChange={personId => props.selectPerson(role, personId)}/>
                    </>)*/}
                {props.readerData?.cancelledBy && <>
                    <div>Abgesagt:</div>
                    <div className="flex flex-col">
                        {props.readerData.cancelledBy.map(id =>
                            <div key={id}>{props.readers.find(reader => reader._id === id)?.name}</div>)}
                    </div>
                </>}

            </div>
        </div>
    </div>;
}
