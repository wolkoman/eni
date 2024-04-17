import {WeeklyEditorStoreData, WeeklyParishItem} from "@/app/intern/wochenmitteilungen-editor/store";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {ArticleComponent} from "@/app/intern/wochenmitteilungen-editor/(announcements)/(components)/Article";
import {TeaserComponent} from "@/app/intern/wochenmitteilungen-editor/(announcements)/(components)/Teaser";
import {WeeklyItemEditor} from "@/app/intern/wochenmitteilungen-editor/(announcements)/ParishEditor";
import {ParishDot} from "../../../../components/calendar/ParishDot";

export function ItemComponent({item, calendar, ...props}: {
  item: WeeklyParishItem,
  calendar?: CalendarName,
  storeData: WeeklyEditorStoreData,
  isActive?: boolean
}) {
  const isWebView = props.isActive === undefined;
  const isSingle = Object.values(item.parishes).filter(x => x).length === 1
  const singleParish = Object.entries(item.parishes).find(x => x[1])?.[0]
  const calendarInfo = getCalendarInfo(singleParish as CalendarName);
  return <div className="relative grow flex flex-col">
    <div
      key={item.id}
      className={(props.isActive ? "z-20" : isWebView ? "shadow" : "hover:bg-black/5 cursor-pointer") + " bg-white break-inside-avoid text-sm border border-black/30 float-start rounded grow flex flex-col"}
    >
      {isSingle && isWebView && <div className={calendarInfo.className + " px-4 py-2"}>
        <ParishDot info={calendarInfo}/>
      </div>}
      <div className="flex flex-col px-4 py-2 grow">
        {item.type === "ARTICLE" && <ArticleComponent item={item}/>}
        {item.type === "TEASER" && <TeaserComponent item={item} storeData={props.storeData}/>}
      </div>
    </div>
    {props.isActive && calendar && <>
        <WeeklyItemEditor item={item} calendar={calendar}/>
    </>}
  </div>
}
