import {Teaser, useWeeklyEditorStore} from "@/app/intern/weekly-editor/store";
import React, {Dispatch, SetStateAction} from "react";
import {Field, SelfServiceInput} from "../../../../components/SelfService";
import {getWeekDayName} from "../../../../components/calendar/Calendar";

export function WeeklyTeaserEditor({form}: { form: [Teaser, Dispatch<SetStateAction<Teaser>>] }) {
  const events = useWeeklyEditorStore(state => state.events)
  const event = events.find(e => e.id === form[0].eventId)
  return <div className="grid gap-2 grow">
    <div className="font-bold text-lg">Terminankündigung: {event?.summary}</div>
      <Field label="Vor dem Veranstaltungsnamen">
        <SelfServiceInput name="preText" form={form} input="textarea"/>
      </Field>
      <Field label="Nach dem Veranstaltungsnamen">
        <SelfServiceInput name="postText" form={form} input="textarea"/>
      </Field>
  </div>;
}

export function TeaserComponent({item}: { item: Teaser }) {
  const events = useWeeklyEditorStore(state => state.events)
  const event = events.find(event => event.id === item.eventId)
  return <div className={`text-center h-full flex flex-col justify-center`}>
    <div className="" dangerouslySetInnerHTML={{__html: item.preText.replace("\n", "<br/>")}}/>
    <div className="flex flex-col justify-center my-6 items-center">
      <div className="font-bold text-2xl ">{event?.summary}</div>
      <div className="text-lg ">am {getWeekDayName(new Date(event?.date ?? "").getDay())},
        den {event?.date.split("-").reverse().join(".").substring(0, 6)}<br/>um {event?.time} Uhr
      </div>
    </div>
    <div className="" dangerouslySetInnerHTML={{__html: item.postText.replaceAll("\n", "<br/>")}}/>
  </div>
}