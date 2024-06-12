import {groupEventsByDate} from "@/domain/events/CalendarGrouper";
import {CalendarEvent} from "@/domain/events/EventMapper";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {WeeklyPageHeader1, WeeklyPageFooter} from "@/app/intern/wochenmitteilungen-editor/Header";
import {WeeklyEditorStoreData} from "@/app/intern/wochenmitteilungen-editor/store";
import {LiturgyData} from "../../../../pages/api/liturgy";
import {getWeekDayName} from "../../../../components/calendar/Calendar";
import {Event} from "./Event"

export const parishes = [CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT];

export function PageEvents(props: { events: CalendarEvent[], liturgy: LiturgyData, storeData: WeeklyEditorStoreData }) {
  const events = groupEventsByDate(props.events);

  return <div className="w-[21cm] h-[29.7cm] bg-white p-12 flex flex-col mx-auto">

    <WeeklyPageHeader1/>

    <div className="my-6 flex justify-center items-center gap-2">
      <div className="text-3xl font-bold">Wochenmitteilungen</div>
      <div className="text-xl font-light px-2 border border-black rounded">{props.storeData.dateRange.name}</div>
    </div>

    <div className="grid grid-cols-[3.5cm_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] text-sm ">
      <div className="border-b border-black"/>
      {parishes.map(calendar =>
        <div key={calendar} className="border-l border-b border-black h-full">
          <div className={`px-2 py-1 ${getCalendarInfo(calendar).borderColor} border-b-4 h-full leading-tight tracking-tight`}>
            {getCalendarInfo(calendar).fullName}
          </div>
        </div>)}
    </div>
    <div className=" flex items-end text-[10pt] overflow-hidden">
      <div className="grid grid-cols-[3.5cm_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] leading-tight">
        {Object.entries(events).map(([dateString, events]) => {
          const date = new Date(dateString)
          const liturgyElement = props.liturgy[date.toISOString().slice(0, 10)];
          const isSpecial = date.getDay() === 0 || liturgyElement?.some(l => l.rank === "H");
          const showLiturgy = ["H", "F"].includes(liturgyElement?.[0].rank) || isSpecial;

          return <div className={`contents`} key={dateString}>

            <div className={`px-2 py-0.5 border-b border-black ${isSpecial ? 'font-semibold text-red-600' : ''}`}>
              <div
                className={isSpecial ? "underline" : ""}>{getWeekDayName(date.getDay())}, {date.getDate()}.{date.getMonth() + 1}.
              </div>
              {showLiturgy && <div className="text-xs font-normal italic">
                {liturgyElement?.[0].name} {liturgyElement?.[0].rank
                ? `(${liturgyElement?.[0].rank})`
                : ""
              }
              </div>}
            </div>

            {parishes.map(calendar =>
              <div
                className={`px-2 py-0.5 border-l border-black border-b`}
                key={calendar}
              >
                {events
                  .filter(event => event.calendar === calendar)
                  .map(event => <Event key={event.id} event={event} storeData={props.storeData}/>)
                }
              </div>
            )}
          </div>;
        })}
      </div>
    </div>

    <WeeklyPageFooter/>

  </div>;
}
