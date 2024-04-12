"use client"

import Link from "next/link";
import {PageEvents, parishes} from "@/app/intern/weekly-editor/(events-page)/PageEvents";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import React, {useState} from "react";
import {ParishDot} from "../../components/calendar/ParishDot";
import {PageParish} from "@/app/intern/weekly-editor/(announcements)/PageParish";
import {WeeklyEditorStoreData} from "@/app/intern/weekly-editor/store";
import {OptionsButton} from "@/app/wochenmitteilungen/OptionsButton";


export function WeeklyActions(props: { storeData: WeeklyEditorStoreData }) {
  const registerLink = (parish: string) => `mailto:kanzlei@eni.wien?subject=${encodeURIComponent("Wochenmitteilungen " + parish)}&body=${encodeURIComponent(`Ich würde mich gerne für die Wochenmitteilungen von ${parish} anmelden.`)}`
  const [printParish, setPrintParish] = useState(CalendarName.EMMAUS)
  const optionStyle = "bg-white px-4 py-1 flex items-center gap-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap"

  function print(calendar: CalendarName) {
    setPrintParish(calendar)
    setTimeout(() => window.print(), 10)
  }

  return <>
    <div className="mb-8 print:hidden flex gap-2 ">
      <OptionsButton label="Für Newsletter anmelden">
        {parishes
          .map(getCalendarInfo)
          .map(calendarInfo =>
            <Link
              key={calendarInfo.id}
              className={optionStyle}
              href={registerLink(calendarInfo.shortName)}
            >
              Pfarre {calendarInfo.shortName}
            </Link>)}
      </OptionsButton>
      <OptionsButton label="Drucken">
        {parishes
          .map(getCalendarInfo)
          .map(calendarInfo =>
            <div
              key={calendarInfo.id}
              className={optionStyle}
              onClick={() => print(calendarInfo.id)}
            >
              Pfarre {calendarInfo.shortName}
            </div>)}
      </OptionsButton>

    </div>

    <div className="hidden print:block">
      <PageEvents events={props.storeData.events} liturgy={{}} storeData={props.storeData}/>
      <PageParish storeData={props.storeData} calendar={printParish}/>
    </div>
  </>;
}
