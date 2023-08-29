"use client"
import React from 'react';
import {useCalendarStore} from "@/store/CalendarStore";
import {toast} from "react-toastify";
import {Liturgy, LiturgyData} from "../../../../pages/api/liturgy";
import {ReaderSite} from "../IndexPage";
import Button from "../../../../components/Button";
import {EventDateText, EventTime} from "../../../../components/calendar/EventUtils";
import {useUserStore} from "@/store/UserStore";
import {getTasksFromReaderData, ReaderInfo, ReaderRole, roleToString} from "@/domain/service/Service";
import {fetchJson} from "@/app/(shared)/FetchJson";
import {useReaderStore} from "@/store/ReaderStore";
import {Links} from "@/app/(shared)/Links";

export function compareLiturgy(a: Liturgy, b: Liturgy) {
    const order = ["H", "F", "G", "", "g"];
    return order.indexOf(a.rank) - order.indexOf(b.rank);
}

export function MyPage(props: { liturgy: LiturgyData }) {

    const {readers, readerData, setReaderData,  ...reader} = useReaderStore(state => state);
    const events = useCalendarStore(state => state.items);
    const [user] = useUserStore(state => [state.user]);
    const myTasks = getTasksFromReaderData(readerData, eventId => events.find(e => e.id === eventId)!)
        .filter(task => task.data.userId === user?._id && task.event.calendar === reader.parish)
        .sort((a, b) => new Date(a.event.date).getTime() - new Date(b.event.date).getTime());

    function cancel(eventId: string, role: ReaderRole) {
        toast.promise(fetchJson(Links.ApiReaderCancel, {json: {eventId, role}}), {
            pending: "Trage aus...",
            success: "Lesung ist ausgetragen!",
            error: "Ein Fehler ist aufgetreten"
        }).then(() => setReaderData({
            [eventId]: {
                ...readerData[eventId],
                [role]: {...readerData[eventId][role], status: "cancelled"}
            }
        }));
    }

    function takeOver(eventId: string, role: ReaderRole) {

        const roleInfo: ReaderInfo = {id: user?._id!, status: "informed", name: user?.name!};
        toast.promise(fetchJson(Links.ApiReaderSave, {json: {[eventId]: {[role]: roleInfo}}}), {
            pending: "Liturgie wird gespeichert",
            error: "Liturgie wurde nicht gespeichert",
            success: "Liturgie wurde gespeichert"
        }).then(() => setReaderData({[eventId]: {...readerData[eventId], [role]: roleInfo}}));
    }

    return <ReaderSite>
        <div className="flex flex-col gap-5">
            <div className="my-4 text-lg font-bold">Liturgische Dienste von {user?.name}</div>
            {myTasks.length === 0 && <div>
                Keine Dienste eingeteilt
            </div>}
            {myTasks.map(task => {
                const activeLiturgy = props.liturgy[task.event.date].find(liturgy => liturgy.name === readerData[task.event.id].liturgy)!;
                const cancelled = task.data.status === "cancelled";
                return <div className="rounded-lg overflow-hidden">
                    {task.data.status === "cancelled" && <div className="bg-black/10 font-bold px-4 py-2">
                        Sie haben sich von diesem Dienst ausgetragen. Danke fürs Bescheid geben!
                    </div>}
                    <div key={task.event.id + task.data.role}
                         className={`bg-black/5 p-6 ${cancelled && "pointer-events-none"} flex justify-between`}>
                        <div>
                            <div className={cancelled ? 'line-through' : ''}>
                                <div className={"font-bold text-lg"}>
                                    <EventDateText date={new Date(task.event.date)}/>,{" "}
                                    <EventTime date={new Date(task.event.start.dateTime)}/> Uhr
                                </div>
                                <div className="text-xl">
                                    {task.event.summary}. {roleToString(task.data.role)}
                                    {(task.data.role === "reading1" || task.data.role === "reading2") && <>: <a
                                        className="underline hover:no-underline" target="_new"
                                        href={`https://bibleserver.com/EU/${encodeURI(activeLiturgy[task.data.role])}`}>
                                        {activeLiturgy[task.data.role]}
                                    </a></>}
                                </div>
                            </div>
                        </div>
                        {!cancelled && <div className="flex items-end">
                            <Button label="Austragen" sure={true}
                                    onClick={() => cancel(task.event.id, task.data.role)}/>
                        </div>}
                    </div>
                </div>;
            })
            }
            <div className="my-4 text-lg font-bold">Alle Dienste</div>
            {Object.entries(readerData)
                .map(([eventId, data]) => ({...data, event: events.find(event => event.id === eventId)!}))
                .filter(data => new Date(data.event?.date) > new Date())
                .sort((a,b) => new Date(a.event?.date).getTime() - new Date(b.event?.date).getTime())
                .map((data) => <div className="flex border-black/10 border-t py-1">
                    <div className="w-60">
                        <div className="font-bold"><EventDateText date={new Date(data.event?.date)}/></div>
                        <div><EventTime date={new Date(data.event?.start.dateTime)}/> {data.event.summary}</div>
                    </div>
                    <div>
                    {(["reading1", "reading2", "communionMinister1", "communionMinister2"] as ReaderRole[])
                        .map(role => ({
                            roleData: data[role],
                            role
                        })).filter(({roleData}) => roleData).map(({roleData, role}) =>
                            <div className={roleData.status === "cancelled" ? 'line-through' : ''}>
                                {roleToString(role)}: {roleData.name}
                                {roleData.status === "cancelled" &&
                                    <Button label="Übernehmen" onClick={() => takeOver(data.event.id, role)}
                                            sure={true}/>}
                            </div>
                        )}
                    </div>
                </div>)}
        </div>
    </ReaderSite>
}
