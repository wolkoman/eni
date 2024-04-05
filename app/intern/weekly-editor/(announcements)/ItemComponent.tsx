"use client"
import {WeeklyParishItem} from "@/app/intern/weekly-editor/store";
import {CalendarName} from "@/domain/events/CalendarInfo";
import {ArticleComponent} from "@/app/intern/weekly-editor/(announcements)/(components)/Article";
import {TeaserComponent} from "@/app/intern/weekly-editor/(announcements)/(components)/Teaser";
import {WeeklyItemEditor} from "@/app/intern/weekly-editor/(announcements)/ParishEditor";

export function ItemComponent({item, calendar, ...props}: {
  item: WeeklyParishItem,
  calendar?: CalendarName,
  onActive?: () => void,
  isActive?: boolean
}) {
  return <div className="relative grow flex flex-col">
    <div
      key={item.id}
      onClick={() => props.onActive?.()}
      className={(props.isActive ? "bg-white z-20" : props.onActive ? "hover:bg-black/5 cursor-pointer" : "") + " break-inside-avoid text-sm border border-black/30 float-start rounded flex flex-col px-4 py-2 grow"}
    >
      {item.type === "ARTICLE" && <ArticleComponent item={item}/>}
      {item.type === "TEASER" && <TeaserComponent item={item}/>}
    </div>
    {props.isActive && calendar && <>
        <WeeklyItemEditor item={item} calendar={calendar}/>
    </>}
  </div>
}