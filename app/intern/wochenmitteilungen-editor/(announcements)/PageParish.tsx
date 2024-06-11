"use client"
import {WeeklyPageHeader2} from "@/app/intern/wochenmitteilungen-editor/Header";
import {WeeklyEditorStoreData, WeeklyParishItem} from "@/app/intern/wochenmitteilungen-editor/store";
import {CalendarName} from "@/domain/events/CalendarInfo";
import React, {useMemo, useState} from "react";
import {ItemComponent} from "@/app/intern/wochenmitteilungen-editor/(announcements)/ItemComponent";
import {WeeklyItemEditor} from "@/app/intern/wochenmitteilungen-editor/(announcements)/ParishEditor";
import {PiArrowsLeftRightBold, PiPencilBold} from "react-icons/pi";

export function ItemToolbar(props: { onEdit: () => void, onSwapSides: () => void }) {
  return <div className="absolute right-0 m-3 group-hover:flex hidden gap-2">
    <PiPencilBold className="cursor-pointer" onClick={props.onEdit}/>
    <PiArrowsLeftRightBold className="cursor-pointer" onClick={props.onSwapSides}/>
  </div>;
}

export function PageParish(props: { calendar: CalendarName, storeData: WeeklyEditorStoreData, isEditable?: boolean }) {

  const isOn = (item: WeeklyParishItem) => item.parishes[props.calendar as 'emmaus']
    ? !!props.storeData.switchSideFor.find(a => a.parish === props.calendar && a.id === item.id)
    : undefined;
  const [active, setActive] = useState("")
  const activeItem = useMemo(() => props.storeData.items.find(item => item.id === active), [active, props])

  const columnStyle = "flex flex-col h-full"
  return <div className="w-[21cm] h-[29.7cm] bg-white p-12 flex flex-col mx-auto">
    {activeItem && props.isEditable && <>
        <div className="fixed inset-0 bg-black/10 z-10 grid place-items-center" onClick={() => setActive("")}>
            <div className="bg-white p-6 w-full max-w-4xl rounded-lg grid grid-cols-2 gap-6 max-h-full my-6 overflow-auto"
                 onClick={event => event.stopPropagation()}>
                <ItemComponent item={activeItem} storeData={props.storeData}/>
                <WeeklyItemEditor item={activeItem}/>
            </div>
        </div>
    </>}
    <WeeklyPageHeader2 parish={props.calendar}/>
    <div className="h-full grid grid-cols-2 my-6 border border-black/20 border-b-0">
      <div className={columnStyle + " border-r border-black/20"}>{props.storeData.items
        .filter(item => isOn(item) === false)
        .map(item => <ItemComponent
          key={item.id}
          storeData={props.storeData}
          item={item}
          calendar={props.calendar}>
          {props.isEditable && <ItemToolbar
              onEdit={() => setActive(item.id)}
              onSwapSides={() => props.storeData.toggleSideFor(item.id, props.calendar)}
          />}
        </ItemComponent>)}
      </div>
      <div className={columnStyle + ""}>{props.storeData.items
        .filter(item => isOn(item) === true)
        .map(item => <ItemComponent
          key={item.id}
          storeData={props.storeData}
          item={item}
          calendar={props.calendar}>
          {props.isEditable && <ItemToolbar
              onEdit={() => setActive(item.id)}
              onSwapSides={() => props.storeData.toggleSideFor(item.id, props.calendar)}
          />}
        </ItemComponent>)}
      </div>
    </div>
  </div>;
}

