import React from 'react';
import {useUserStore} from "../../../util/use-user-store";
import {getLiturgyData, Liturgy, LiturgyData} from "../../api/liturgy";
import {useAuthenticatedReaderStore} from "../../../util/use-reader-store";
import {ReaderSite} from "./index";
import {getTasksFromReaderData} from "../../../util/reader";
import {EventDateText, EventTime} from "../../../components/calendar/Event";
import Button from "../../../components/Button";
import {fetchJson} from "../../../util/fetch-util";

export function compareLiturgy(a: Liturgy, b: Liturgy) {
    const order = ["H", "F", "G", "", "g"];
    return order.indexOf(a.rank) - order.indexOf(b.rank);
}

export default function Index(props: { liturgy: LiturgyData }) {

    const {readers, readerData, setReaderData, events, ...reader} = useAuthenticatedReaderStore();
    const [userId, jwt] = useUserStore(state => [state.user?._id, state.jwt]);
    const myTasks = getTasksFromReaderData(readerData, eventId => events.find(e => e.id === eventId)!)
        .filter(task => task.data.userId === userId && task.event.calendar === reader.parish)
        .sort((a, b) => new Date(a.event.date).getTime() - new Date(b.event.date).getTime());

    function cancel(eventId: string, role: 'reading1' | 'reading2') {
        fetchJson("/api/reader/cancel", {jwt, json: {eventId, role}}, {
            pending: "Trage aus...",
            success: "Lesung ist ausgetragen!",
            error: "Ein Fehler ist aufgetreten"
        }).then(() => setReaderData({[eventId]: {...readerData[eventId], [role]: {...readerData[eventId][role], status: "cancelled"}}}));
    }

    return <ReaderSite>
        <div className="flex flex-col gap-2">
            <div className="my-4 text-lg font-bold">Meine Lesungen</div>
            {myTasks.length === 0 && <div>
                Keine Lesungen eingeteilt.
            </div>}
            {myTasks.map(task => {
                const activeLiturgy = props.liturgy[task.event.date].find(liturgy => liturgy.name === readerData[task.event.id].liturgy)!;
                const cancelled = task.data.status === "cancelled";
                return <div
                    key={task.event.id + task.data.role}
                    className={`bg-black/5 p-6 rounded-lg my-4 ${cancelled && "opacity-50 pointer-events-none"}`}>
                    <div className={"font-bold text-xl"}><EventDateText
                        date={new Date(task.event.date)}/>, <EventTime
                        date={new Date(task.event.start.dateTime)}/> Uhr
                    </div>
                    <div className="text-3xl">
                        <div className="relative inline-block">
                            {task.event.summary}
                            {cancelled &&
                                <div className="absolute inset-0 border-t-2 border-black -rotate-6 translate-y-1/2"></div>
                            }
                        </div>
                    </div>
                    <div className="text-lg my-2">{task.data.role.substring(7, 8)}. Lesung:{" "}
                        <a
                            className="underline hover:no-underline" target="_new"
                            href={`https://bibleserver.com/EU/${encodeURI(activeLiturgy[task.data.role])}`}>
                            {activeLiturgy[task.data.role]}
                        </a></div>
                    <div className="flex justify-end">
                        {!cancelled &&
                            <Button label="Austragen" sure={true} onClick={() => cancel(task.event.id, task.data.role)}/>
                        }
                    </div>
                </div>;
            })
            }
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