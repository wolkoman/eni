import {WeeklyEditorStoreData} from "@/app/intern/wochenmitteilungen-editor/store";
import React from "react";
import {ItemComponent} from "@/app/intern/wochenmitteilungen-editor/(announcements)/ItemComponent";
import {CalendarName} from "@/domain/events/CalendarInfo";
import {PiArrowArcLeftBold} from "react-icons/pi";
import Link from "next/link";
import {Links} from "@/app/(shared)/Links";

export function WeeklyContent(props: {
  storeData: WeeklyEditorStoreData,
  calendar?: CalendarName
}) {
  return <>
    {props.calendar && <Link className="inline-flex gap-2 mb-4 print:hidden" href={Links.Wochenmitteilungen()}>
        <PiArrowArcLeftBold/> Alle Pfarren anzeigen
    </Link>}
    <div className="print:hidden lg:columns-2 gap-6">
      {props.storeData.items
        .filter(item => props.calendar === undefined || item.parishes[props.calendar as 'emmaus'])
        .map(item => <div key={item.id} className="mb-6">
          <ItemComponent item={item} storeData={props.storeData} isWebview={true}/>
        </div>)}
    </div>
  </>;
}
