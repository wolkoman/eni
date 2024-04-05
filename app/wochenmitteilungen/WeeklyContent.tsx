"use client"
import {CalendarEvent} from "@/domain/events/EventMapper";
import {WeeklyEditorStoreData} from "@/app/intern/weekly-editor/store";
import {PageEvents} from "@/app/intern/weekly-editor/(events-page)/PageEvents";
import React from "react";
import {ItemComponent} from "@/app/intern/weekly-editor/(announcements)/ItemComponent";
import {PageParish} from "@/app/intern/weekly-editor/(announcements)/PageParish";
import {CalendarName} from "@/domain/events/CalendarInfo";

export function WeeklyContent(props: {
  events: CalendarEvent[],
  storeData: WeeklyEditorStoreData,
}) {
  return <>
    <div className="hidden print:block">
      <PageEvents events={props.events} liturgy={{}} storeData={props.storeData}/>
      <PageParish storeData={props.storeData} calendar={CalendarName.EMMAUS}/>
      <PageParish storeData={props.storeData} calendar={CalendarName.INZERSDORF}/>
      <PageParish storeData={props.storeData} calendar={CalendarName.NEUSTIFT}/>
    </div>
    <div className="grid lg:grid-cols-2 gap-2 print:hidden">
      {props.storeData.items.map(item => <ItemComponent item={item} key={item.id}/>)}
    </div>
  </>;
}