import {groupEventsByDate} from "@/domain/events/CalendarGrouper";
import {CalendarEvent} from "@/domain/events/EventMapper";
import {getWeekDayName} from "../../../components/calendar/Calendar";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {ElementRef, useRef} from "react";
import {LiturgyData} from "../../../pages/api/liturgy";
import {WeeklyPageHeader} from "@/app/intern/weekly-editor/WeeklyPageHeader";
import {WeeklyEvent} from "@/app/intern/weekly-editor/WeeklyEvent";
import {getWeekOfYear} from "@/app/(shared)/WeekOfYear";

const calendars = [CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT];

export function WeeklyEventsPage(props: { events: CalendarEvent[], liturgy: LiturgyData }) {
  const ref = useRef<ElementRef<'div'>>(null);
  const events = groupEventsByDate(props.events);
  const lastDate = new Date(props.events.at(-1)?.date!);

  return <div className="w-[21cm] h-[29.7cm] border border-black/20 p-12 flex flex-col mx-auto">

    <WeeklyPageHeader lastDate={lastDate}/>

    <div className="my-6 flex justify-center items-center gap-2">
      <div className="text-3xl font-semibold tracking-tight">Wochenmitteilungen  </div>
      <div className="text-xl px-2 py-0.5 border border-black rounded-lg">KW{getWeekOfYear(lastDate)} {lastDate.getFullYear()}</div>
    </div>

    <div className="grid grid-cols-[3.5cm_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] text-sm font-semibold">
      <div className="border-b border-black"/>
      {calendars.map(calendar =>
        <div key={calendar} className="border-l border-b border-black h-full">
          <div className={`px-2 py-1 ${getCalendarInfo(calendar).borderColor} border-b-4 h-full`}>
            {getCalendarInfo(calendar).fullName}
          </div>
        </div>)}
    </div>
    <div className=" flex items-end text-[10pt] overflow-hidden">
      <div className="grid grid-cols-[3.5cm_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] leading-tight" ref={ref}>
        {Object.entries(events).map(([dateString, events]) => {
          const date = new Date(dateString)
          const liturgyElement = props.liturgy[date.toISOString().slice(0, 10)];
          const isSpecial = date.getDay() === 0 || liturgyElement?.some(l => l.rank === "H");
          const showLiturgy = ["H", "F"].includes(liturgyElement?.[0].rank) || isSpecial;

          return <div className={`contents`} key={dateString}>

            <div className={`px-2 py-0.5 border-b border-black ${isSpecial ? 'bg-black/5 font-semibold' : ''}`}>
              <div>{getWeekDayName(date.getDay())}, {date.getDate()}.{date.getMonth() + 1}.</div>
              {showLiturgy && <div className="text-xs font-normal italic">
                {liturgyElement?.[0].name} {liturgyElement?.[0].rank
                ? `(${liturgyElement?.[0].rank})`
                : ""
              }
              </div>}
            </div>

            {calendars.map(calendar =>
              <div
                className={`px-2 py-0.5 border-l border-black border-b ${isSpecial ? 'bg-black/5' : ''}`}
                key={calendar}
              >
                {events
                  .filter(event => event.calendar === calendar)
                  .map(event => <WeeklyEvent event={event}/>)
                }
              </div>
            )}
          </div>;
        })}
      </div>
    </div>
  </div>;
}