import {WeeklyEditorStoreData} from "@/app/intern/weekly-editor/store";
import {PageEvents} from "@/app/intern/weekly-editor/(events-page)/PageEvents";
import React from "react";
import {ItemComponent} from "@/app/intern/weekly-editor/(announcements)/ItemComponent";
import {PageParish} from "@/app/intern/weekly-editor/(announcements)/PageParish";
import {CalendarName} from "@/domain/events/CalendarInfo";

export function WeeklyContent(props: {
  storeData: WeeklyEditorStoreData,
}) {
  return <>
    <div className="hidden print:block">
      <PageEvents events={props.storeData.events} liturgy={{}} storeData={props.storeData}/>
      <PageParish storeData={props.storeData} calendar={CalendarName.EMMAUS}/>
      <PageParish storeData={props.storeData} calendar={CalendarName.INZERSDORF}/>
      <PageParish storeData={props.storeData} calendar={CalendarName.NEUSTIFT}/>
    </div>
    <div className="print:hidden lg:columns-2 gap-6">
      {props.storeData.items.map(item => <div key={item.id} className="mb-6" ><ItemComponent item={item} storeData={props.storeData}  /></div>)}
    </div>
  </>;
}
