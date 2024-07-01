"use client"

import Link from "next/link";
import {PageEvents} from "@/app/intern/wochenmitteilungen-editor/(events-page)/PageEvents";
import React from "react";
import {WeeklyEditorStoreData} from "@/app/intern/wochenmitteilungen-editor/store";
import {LiturgyData} from "../../pages/api/liturgy";
import Button from "@/components/Button";


export function WeeklyActions(props: { storeData: WeeklyEditorStoreData, liturgy: LiturgyData }) {
  const registerLink = (parish: string) => `mailto:admin@eni.wien?subject=${encodeURIComponent("Wochenmitteilungen " + parish)}&body=${encodeURIComponent(`Ich würde mich gerne für die Wochenmitteilungen von ${parish} anmelden.`)}`

  function print() {
    setTimeout(() => window.print(), 10)
  }

  return <>
    <div className="mb-8 print:hidden flex gap-2 ">
      <Link href={registerLink("Pfarre Emmaus")}>
        <Button label="Newsletter abonnieren" />
        </Link>
      <Button label="Drucken" onClick={() => print()}>
      </Button>

    </div>

    <div className="print:block print:static print:opacity-100 absolute opacity-0 pointer-events-none">
      <PageEvents events={props.storeData.events} liturgy={props.liturgy} storeData={props.storeData}/>
    </div>
  </>;
}
