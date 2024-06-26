import {groupEventsByDate} from "@/domain/events/CalendarGrouper";
import {CalendarEvent} from "@/domain/events/EventMapper";
import {CalendarName} from "@/domain/events/CalendarInfo";
import {WeeklyPageFooter, WeeklyPageHeader2} from "@/app/intern/wochenmitteilungen-editor/Header";
import {WeeklyEditorStoreData, WeeklyParishItem} from "@/app/intern/wochenmitteilungen-editor/store";
import {LiturgyData} from "../../../../pages/api/liturgy";
import {getWeekDayName} from "../../../../components/calendar/Calendar";
import {Event} from "./Event"
import {ItemComponent} from "@/app/intern/wochenmitteilungen-editor/(announcements)/ItemComponent";
import React, {useMemo, useState} from "react";
import {ItemToolbar} from "@/app/intern/wochenmitteilungen-editor/(announcements)/PageParish";
import {WeeklyItemEditor} from "@/app/intern/wochenmitteilungen-editor/(announcements)/ParishEditor";

export const parishes = [CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT];

function ParishEvents(props: {
  events: Record<string, CalendarEvent[]>,
  calendar: CalendarName,
  storeData: WeeklyEditorStoreData,
  liturgy: LiturgyData,
  dateMatch?: string
}) {
  return <div className="px-6 py-4 border-b first-child:border-t border-black grow">
    <div className="flex justify-between my-3 items-end ">
      <div className="font-semibold text-lg leading-tight">Termine</div>
    </div>
    <div className="grid grid-cols-[min-content_auto] leading-tight text-[10pt] overflow-hidden gap-y-2 gap-x-2">
      {Object.entries(props.events)
        .map(([dateString, events]) => [dateString, events.filter(e => e.calendar === props.calendar)] as [string, CalendarEvent[]])
        .filter(([dateString, events]) => !props.dateMatch || dateString.includes(props.dateMatch))
        .filter(([dateString, events]) => events.length > 0)
        .map(([dateString, events]) => {
          const date = new Date(dateString)
          const liturgyElement = props.liturgy[date.toISOString().slice(0, 10)];
          const isSpecial = date.getDay() === 0 || liturgyElement?.some(l => l.rank === "H");
          const showLiturgy = ["H", "F"].includes(liturgyElement?.[0].rank) || isSpecial;

          return <div className={`contents`} key={dateString}>
            <div className={`${isSpecial ? 'font-semibold text-red-600' : ''}`}>
              <div className={`whitespace-nowrap ${isSpecial ? "underline" : ""}`}>
                {getWeekDayName(date.getDay())}, {date.getDate()}.{date.getMonth() + 1}.
              </div>
              {showLiturgy && <div className="text-xs font-normal">
                {liturgyElement?.[0].name.replaceAll("im Jahreskreis", "i.J.")} {liturgyElement?.[0].rank
                ? `(${liturgyElement?.[0].rank})`
                : ""
              }
              </div>}
            </div>

            <div className={``}>
              {events
                .filter(event => event.calendar === props.calendar)
                .map(event => <Event key={event.id} event={event} storeData={props.storeData}/>)
              }
            </div>
          </div>;
        })}
    </div>
  </div>;
}

export function PageEvents(props: {
  events: CalendarEvent[],
  liturgy: LiturgyData,
  storeData: WeeklyEditorStoreData,
  calendar: CalendarName,
  isEditable?: boolean
}) {
  const events = groupEventsByDate(props.events);
  const isOn = (item: WeeklyParishItem) => item.parishes[props.calendar as 'emmaus']
    ? !!props.storeData.switchSideFor.find(a => a.parish === props.calendar && a.id === item.id)
    : undefined;
  const [active, setActive] = useState("")
  const activeItem = useMemo(() => props.storeData.items.find(item => item.id === active), [active, props])

  const columnStyle = "flex flex-col h-full"

  return <div className="w-[21cm] h-[29.7cm] bg-white p-12 flex flex-col mx-auto">

    <WeeklyPageHeader2 parish={props.calendar}/>

    {activeItem && props.isEditable && <>
        <div className="fixed inset-0 bg-black/10 z-10 grid place-items-center" onClick={() => setActive("")}>
            <div
                className="bg-white p-6 w-full max-w-4xl rounded-lg grid grid-cols-2 gap-6 max-h-full my-6 overflow-auto"
                onClick={event => event.stopPropagation()}>
                <ItemComponent item={activeItem} storeData={props.storeData}/>
                <WeeklyItemEditor item={activeItem}/>
            </div>
        </div>
    </>}

    <div className="my-6 flex justify-center items-center gap-2">
      <div className="text-3xl font-bold">Wochenmitteilungen</div>
      <div className="text-xl font-light px-2 border border-black rounded">{props.storeData.dateRange.name}</div>
    </div>

    <div className="h-full grid grid-cols-2 border border-black border-b-0">
      <div className={columnStyle + " border-r border-black"}>
        <ParishEvents events={events} calendar={props.calendar} liturgy={{}} storeData={props.storeData}/>
        {props.storeData.items
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
      <div className={columnStyle + ""}>
        {props.storeData.items
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

    <WeeklyPageFooter/>

  </div>;
}
