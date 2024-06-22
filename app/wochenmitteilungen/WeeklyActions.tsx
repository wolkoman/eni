"use client"

import Link from "next/link";
import {PageEvents} from "@/app/intern/wochenmitteilungen-editor/(events-page)/PageEvents";
import {CalendarName} from "@/domain/events/CalendarInfo";
import React, {useState} from "react";
import {PageParish} from "@/app/intern/wochenmitteilungen-editor/(announcements)/PageParish";
import {WeeklyEditorStoreData} from "@/app/intern/wochenmitteilungen-editor/store";
import {LiturgyData} from "../../pages/api/liturgy";
import Button from "@/components/Button";


export function WeeklyActions(props: { storeData: WeeklyEditorStoreData, liturgy: LiturgyData }) {
  const registerLink = (parish: string) => `mailto:admin@eni.wien?subject=${encodeURIComponent("Wochenmitteilungen " + parish)}&body=${encodeURIComponent(`Ich würde mich gerne für die Wochenmitteilungen von ${parish} anmelden.`)}`
  const [printParish, setPrintParish] = useState(CalendarName.EMMAUS)

  function print(calendar: CalendarName) {
    setPrintParish(calendar)
    setTimeout(() => window.print(), 100)
  }

  return <>
    <div className="mb-8 print:hidden flex gap-2 ">
      <Link href={registerLink("Pfarre Emmaus")}>
        <Button label="Newsletter abonnieren" />
        </Link>
      <Button label="Drucken" onClick={() => print(CalendarName.EMMAUS)}>
      </Button>

    </div>

    <div className="print:block print:static print:opacity-100 absolute opacity-0 pointer-events-none">
      <PageEvents events={props.storeData.events} liturgy={props.liturgy} storeData={props.storeData}/>
    </div>
    <div className="hidden print:block">
      <PageParish storeData={props.storeData} calendar={printParish}/>
    </div>
  </>;
}
