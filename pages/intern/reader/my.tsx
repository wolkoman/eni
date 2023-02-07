import React from 'react';
import {useUserStore} from "../../../util/use-user-store";
import {getLiturgyData, Liturgy, LiturgyData} from "../../api/liturgy";
import {useAuthenticatedReaderStore} from "../../../util/use-reader-store";
import {ReaderSite} from "./index";
import {getTasksFromReaderData, ReaderInfo, ReaderRole, roleToString} from "../../../util/reader";
import Button from "../../../components/Button";
import {fetchJson} from "../../../util/fetch-util";
import {EventDateText, EventTime} from "../../../components/calendar/EventUtils";

export function compareLiturgy(a: Liturgy, b: Liturgy) {
    const order = ["H", "F", "G", "", "g"];
    return order.indexOf(a.rank) - order.indexOf(b.rank);
}

export default function Index(props: { liturgy: LiturgyData }) {

    const {readers, readerData, setReaderData, events, ...reader} = useAuthenticatedReaderStore();
    const [user] = useUserStore(state => [state.user]);
    const myTasks = getTasksFromReaderData(readerData, eventId => events.find(e => e.id === eventId)!)
        .filter(task => task.data.userId === user?._id && task.event.calendar === reader.parish)
        .sort((a, b) => new Date(a.event.date).getTime() - new Date(b.event.date).getTime());

    function cancel(eventId: string, role: ReaderRole) {
        fetchJson("/api/reader/cancel", {json: {eventId, role}}, {
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
        fetchJson("/api/reader/save", {json: {[eventId]: {[role]: roleInfo}}}, {
            pending: "Liturgie wird gespeichert",
            error: "Liturgie wurde nicht gespeichert",
            success: "Liturgie wurde gespeichert"
        }).then(() => setReaderData({[eventId]: {...readerData[eventId], [role]: roleInfo}}));
    }

    return <ReaderSite>
        <div className="flex flex-col gap-2">
            <div className="my-4 text-lg font-bold">Liturgische Dienste von {user?.name}</div>
            {myTasks.length === 0 && <div>
                Keine Dienste eingeteilt
            </div>}
            {myTasks.map(task => {
                const activeLiturgy = props.liturgy[task.event.date].find(liturgy => liturgy.name === readerData[task.event.id].liturgy)!;
                const cancelled = task.data.status === "cancelled";
                return <div
                    key={task.event.id + task.data.role}
                    className={`bg-black/5 p-6 rounded-lg my-4 ${cancelled && "opacity-50 pointer-events-none"}`}>
                    {task.data.status === "cancelled" && <div className="bg-red-700 text-white font-bold rounded px-3">
                        Die Planung wurde über die Absage informiert. Danke fürs Bescheid geben!
                    </div>}
                    <div className={task.data.status === "cancelled" ? 'line-through' : ''}>
                        <div className={"font-bold text-xl"}>
                            <EventDateText date={new Date(task.event.date)}/>,{" "}
                            <EventTime date={new Date(task.event.start.dateTime)}/> Uhr
                        </div>
                        <div className="text-3xl">
                            {task.event.summary}
                        </div>
                        <div className="text-lg my-2">{roleToString(task.data.role)}
                            {task.data.role === "reading1" || task.data.role === "reading2" && <>: <a
                                className="underline hover:no-underline" target="_new"
                                href={`https://bibleserver.com/EU/${encodeURI(activeLiturgy[task.data.role])}`}>
                                {activeLiturgy[task.data.role]}
                            </a></>}</div>
                        <div className="flex justify-end">
                            {!cancelled &&
                                <Button label="Austragen" sure={true}
                                        onClick={() => cancel(task.event.id, task.data.role)}/>
                            }
                        </div>

                    </div>
                </div>;
            })
            }
            <div className="my-4 text-lg font-bold">Alle Dienste</div>
            {Object.entries(readerData)
                .map(([eventId, data]) => ({...data, event: events.find(event => event.id === eventId)!}))
                .filter(data => new Date(data.event?.date) > new Date())
                .map((data) => <div>
                    <div className="font-bold"><EventDateText
                        date={new Date(data.event?.date)}/>: {data.event.summary}
                    </div>
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