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
  isWebview?: boolean,
  children?: React.ReactNode,
}) {
  const isSingle = Object.values(item.parishes).filter(x => x).length === 1
  const singleParish = Object.entries(item.parishes).find(x => x[1])?.[0]
  const calendarInfo = getCalendarInfo(singleParish as CalendarName);
  return <div className="relative grow flex flex-col group">
    <div
      key={item.id}
      className={(props.isWebview ? "shadow rounded border border-black/20 bg-white pb-2" : "py-2") + " break-inside-avoid text-sm border-b first-child:border-t border-black grow flex flex-col"}
    >
      {isSingle && props.isWebview && <div className={calendarInfo.className + " px-4 py-2"}>
        <ParishDot info={calendarInfo}/>
      </div>}
      {props.children}
      <div className="flex flex-col px-6 py-2 grow">
        {item.type === "ARTICLE" && <ArticleComponent item={item}/>}
        {item.type === "TEASER" && <TeaserComponent item={item} storeData={props.storeData}/>}
      </div>
    </div>
  </div>
}
