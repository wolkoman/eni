import React, {useState} from 'react';
import Site from '../../../components/Site';
import {groupEventsByDate, useAuthenticatedCalendarStore} from "../../../util/use-calendar-store";
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

export default function Index(props: { liturgy: LiturgyData }) {

    const {readers, readerData, setReaderData, events, ...reader} = useAuthenticatedReaderStore();
    const jwt = useUserStore(state => state.jwt);

    const tasks = getTasksFromReaderData(readerData, id => events.find(event => event.id === id)!);
    const parishReaders = readers.filter(person => person.parish === reader.parish || person.parish === "all");

    async function informPersonPerMail(tasks: ReaderTask<CalendarEvent>[]) {
        await fetchJson("/api/reader/mail", {
            jwt,
            json: {eventIds: tasks.map(job => job.event.id), personId: tasks[0].data.userId}
        }, {
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
        return fetchJson("/api/reader/save", {jwt, json: changes({})}, {
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
                            {tasks.map(({event, data}) =>
                                <div key={event.id + data.role} className="flex gap-1 items-center">
                                    <div className={`w-3 h-3 mr-1 grow-0 rounded ${{
                                        cancelled: "bg-red-600",
                                        assigned: "bg-blue-500",
                                        informed: "bg-green-600"
                                    }[data.status]}`}/>
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