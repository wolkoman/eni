import {CalendarEvent} from "@/domain/events/EventMapper";
import {CalendarGroup} from "@/domain/events/CalendarGroup";
import {WeeklyEditorStoreData} from "@/app/intern/weekly-editor/store";
import React, {useEffect, useRef} from "react";
import {PiWarningFill} from "react-icons/pi";
import {EventPopup} from "@/app/intern/weekly-editor/(events-page)/EventPopup";

export function Event(props: { event: CalendarEvent, storeData: WeeklyEditorStoreData }) {
  const special = props.event.groups.includes(CalendarGroup.Messe)
  const mainPersons = {
    "Brez": "Pfr. Z.B.",
    "Marcin": "Pfv. M.",
    "Gil": "Kpl. G.",
    "David": "Kpl. D.",
  }
  const ref = useRef<HTMLTextAreaElement>(null)
  const summary = props.event.summary.replaceAll("Sakramentenvorbereitung Versöhnung und Kommunion", "Sakramenten​vorbereitung")
  const customDescription = props.storeData.customEventDescription[props.event.id]
  const description = customDescription ?? props.event.description;
  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "0px";
    ref.current.style.height = ref.current.scrollHeight + "px";
  }, [ref.current, description]);

  return <div
    className={`flex ${special ? 'font-semibold' : ''} mb-0.5 group relative`}>
    {description != props.event.description && <PiWarningFill className="text-yellow-600/50 absolute top-0.5 right-0 translate-x-1/2 print:hidden"/>}
    <div className="w-[1cm] shrink-0">{props.event.time}</div>
    <div className="w-full">
      <div className="">
        <div className="inline">{summary}</div>
        {Object.entries(mainPersons)
          .filter(([name]) => props.event.mainPerson?.includes(name))
          .map(([_, initial]) =>
            <div key={initial} className="text-xs font-normal opacity-50 rounded pl-1.5 inline-block">{initial}</div>
          )}
      </div>
      {!!description && <textarea
          ref={ref}
          className="text-xs font-normal leading-tight resize-none h-fit overflow-y-hidden w-full"
          onChange={event => props.storeData.setCustomDescription(
            props.event.id,
            props.event.description == event.target.value ? null : event.target.value
          )}
          value={description}
          rows={0}
      />}
    </div>
    <EventPopup event={props.event}/>
  </div>;
}