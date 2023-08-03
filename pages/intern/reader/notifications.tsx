import React from 'react';
import {getLiturgyData, LiturgyData} from "../../api/liturgy";
import {fetchJson} from "../../../util/fetch-util";
import Button from "../../../components/Button";
import {
    getTasksForPerson,
    getTasksFromReaderData,
    getUninformedTasks,
    ReaderTask,
    roleToString
} from "../../../util/reader";
import {useAuthenticatedReaderStore} from "../../../util/store/use-reader-store";
import {ReaderSite} from "./index";
import {useAuthenticatedCalendarStore} from "../../../util/store/use-calendar-store";
import {CalendarEvent} from "../../../app/termine/EventMapper";
import {toast} from "react-toastify";

export default function Index(props: { liturgy: LiturgyData }) {

    const {items: events} = useAuthenticatedCalendarStore();
    const {readers, readerData, setReaderData, ...reader} = useAuthenticatedReaderStore();

    const tasks = getTasksFromReaderData(readerData, id => events.find(event => event.id === id)!)
        .filter(task => new Date(task.event?.date) > new Date());
    const parishReaders = readers.filter(person => person.parish === reader.parish || person.parish === "all");

    async function informPersonPerMail(tasks: ReaderTask<CalendarEvent>[]) {
        await toast.promise(fetchJson("/api/reader/mail", {
            json: {eventIds: tasks.map(job => job.event.id), personId: tasks[0].data.userId}
        }), {
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
                name: readers.find(reader => reader._id === job.data.userId)?.name,
                status: 'informed'
            }
        }]));
        return toast.promise(fetchJson("/api/reader/save", {json: changes({})}), {
            pending: "Status wird gespeichert",
            error: "Status wurde nicht gespeichert",
            success: "Status wurde gespeichert"
        }).then(() => setReaderData(changes(readerData)))
    }

    return <ReaderSite>
        <div className="flex flex-col gap-3">
            {parishReaders
                .map(person => ({person, tasks: getTasksForPerson(tasks, person._id)}))
                .map(({person, tasks}) => ({person, tasks, uninformedTasks: getUninformedTasks(tasks)}))
                .map(({person, tasks, uninformedTasks}) =>
                    <div key={person._id} className="flex flex-col gap-2 px-4 py-2 rounded-lg bg-black/5">
                        <div className="font-bold">{person.name}</div>
                        <div>
                            {tasks.filter(({event}) => event).map(({event, data}) =>
                                <div key={event?.id + data.role} className="flex gap-1 items-center">
                                    <div className={`w-3 h-3 mr-1 grow-0 rounded ${{
                                        cancelled: "bg-red-600",
                                        assigned: "bg-blue-500",
                                        informed: "bg-green-600"
                                    }[data.status]}`}/>
                                    <div>
                                        {new Date(event.date).toLocaleDateString()} {new Date(event.start.dateTime).toLocaleTimeString().substring(0, 5)}
                                    </div>
                                    <div>
                                        {event.summary} ({roleToString(data.role)})
                                    </div>
                                </div>
                            )}
                        </div>
                        {uninformedTasks.length > 0 && <div className="flex justify-end gap-1">
                            <Button label="Persönlich informieren"
                                    onClick={() => informPersonPersonally(uninformedTasks)}/>
                            {person.email && <Button label="Per Mail informieren"
                                                     onClick={() => informPersonPerMail(uninformedTasks)}/>}
                        </div>}
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
