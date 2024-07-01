"use client"

import React from 'react';
import {toast} from "react-toastify";
import {useReaderStore} from "../../../(store)/ReaderStore";
import {CalendarEvent} from "../../../(domain)/events/EventMapper";
import {ReaderSite} from "../IndexPage";
import Button from "../../../../components/Button";
import {
  getTasksForPerson,
  getTasksFromReaderData,
  getUninformedTasks,
  ReaderTask,
  roleToString
} from "../../../(domain)/service/Service";
import {fetchJson} from "../../../(shared)/FetchJson";
import {Links} from "../../../(shared)/Links";
import {PiWarningBold} from "react-icons/pi";
import {getColorForStatus} from "@/app/intern/reader/GetColorForStatus";

export default function NotificationsPage() {

  const {readers, readerData, setReaderData, events, ...reader} = useReaderStore(state => state);

  const tasks = getTasksFromReaderData(readerData, id => events.find(event => event.id === id)!)
    .filter(task => new Date(task.event?.date) > new Date());

  async function informPersonPerMail(tasks: ReaderTask<CalendarEvent>[]) {
    await toast.promise(fetchJson(Links.ApiReaderMail, {
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
    return toast.promise(fetchJson(Links.ApiReaderSave, {json: changes({})}), {
      pending: "Status wird gespeichert",
      error: "Status wurde nicht gespeichert",
      success: "Status wurde gespeichert"
    }).then(() => setReaderData(changes(readerData)))
  }

  return <ReaderSite>
    <div className="flex flex-col gap-3">
      {readers
        .map(person => ({person, tasks: getTasksForPerson(tasks, person._id)}))
        .map(({person, tasks}) => ({person, tasks, uninformedTasks: getUninformedTasks(tasks)}))
        .map(({person, tasks, uninformedTasks}) =>
          <div key={person._id} className="flex flex-col gap-2 px-4 py-2 rounded border border-black/20">
            <div className="font-bold">{person.name}</div>
            <div>
              {tasks.filter(({event}) => event).map(({event, data}) => <div>
                <div key={event?.id + data.role} className="flex gap-1 items-center">
                  <div className={`w-3 h-3 mr-1 grow-0 rounded ${(getColorForStatus(data.status))}`}/>
                  <div>
                    {new Date(event.date).toLocaleDateString("de-AT")} {new Date(event.start.dateTime).toLocaleTimeString().substring(0, 5)}
                  </div>
                  <div>
                    {event.summary} ({roleToString(data.role)})
                  </div>
                </div>

                {event.visibility === "private" && <div className="flex gap-1 items-center text-sm pl-4"><PiWarningBold/> Diese Termin ist vertraulich und kann nicht eingeteilt werden!</div>}
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
