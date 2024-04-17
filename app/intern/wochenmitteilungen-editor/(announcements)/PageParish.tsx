"use client"
import {WeeklyPageHeader2} from "@/app/intern/wochenmitteilungen-editor/Header";
import {WeeklyEditorStoreData, WeeklyParishItem} from "@/app/intern/wochenmitteilungen-editor/store";
import {CalendarName} from "@/domain/events/CalendarInfo";
import {useState} from "react";
import {ItemComponent} from "@/app/intern/wochenmitteilungen-editor/(announcements)/ItemComponent";

export function PageParish(props: { calendar: CalendarName, storeData: WeeklyEditorStoreData }) {

  const isOn = (item: WeeklyParishItem) => item.parishes[props.calendar as 'emmaus']
    ? !!props.storeData.switchSideFor.find(a => a.parish === props.calendar && a.id === item.id)
    : undefined;
  const [active, setActive] = useState("")

  const columnStyle = "flex flex-col gap-6 h-full"
  return <div className="w-[21cm] h-[29.7cm] bg-white border border-black/20 p-12 flex flex-col mx-auto">
    {active && <div className="fixed top-0 left-0 w-full h-full bg-black/10 z-10" onClick={() => setActive("")}/>}
    <WeeklyPageHeader2 parish={props.calendar}/>
    <div className="h-full grid grid-cols-2 gap-6 my-6">
      <div className={columnStyle}>{props.storeData.items
        .filter(item => isOn(item) === false)
        .map(item => <div
          key={item.id}
          className="flex flex-col grow"
          onClick={() => setActive(item.id)}>
          <ItemComponent
            storeData={props.storeData}
            item={item}
            calendar={props.calendar}
            isActive={item.id === active}
          /></div>)}
      </div>
      <div className={columnStyle}>{props.storeData.items
        .filter(item => isOn(item) === true)
        .map(item => <div
          key={item.id}
          className="flex flex-col grow"
          onClick={() => setActive(item.id)}>
          <ItemComponent
            storeData={props.storeData}
            item={item}
            calendar={props.calendar}
            isActive={item.id === active}
          /></div>)}
      </div>
    </div>
  </div>;
}

