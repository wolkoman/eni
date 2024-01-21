import {groupEventsByDate} from "@/domain/events/CalendarGrouper";
import {CalendarEvent} from "@/domain/events/EventMapper";
import {getWeekDayName} from "../../../components/calendar/Calendar";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {ElementRef, useRef} from "react";
import {LiturgyData} from "../../../pages/api/liturgy";
import {CalendarGroup} from "@/domain/events/CalendarGroup";
import {WeeklyPageHeader} from "@/app/intern/weekly-editor/WeeklyPageHeader";

function WeeklyEvent(props: { event: CalendarEvent }) {
  const special = props.event.groups.includes(CalendarGroup.Messe)
  const mainPersons = {
    "Brez": "Pfr. Z.B.",
    "Marcin": "Pfv. M.",
    "Gil": "Kpl. G.",
    "David": "Kpl. D.",
  }
  return <div className={`flex ${special ? 'font-semibold' : ''}`}>
    <div className="w-[1cm] shrink-0">{props.event.time}</div>
    <div className="w-full">
      <div className="flex w-full justify-between">
        <div className="">{props.event.summary}</div>
        {Object.entries(mainPersons)
          .filter(([name]) => props.event.mainPerson?.includes(name))
          .map(([_, initial]) =>
            <div className="text-xs font-normal opacity-50 border border-black/20 rounded px-1">{initial}</div>
          )}
      </div>
      <div className="text-xs font-normal"> {props.event.description}</div>
    </div>

  </div>;
}

const calendars = [CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT];

export function WeeklyEventsPage(props: { events: CalendarEvent[], liturgy: LiturgyData }) {
  const ref = useRef<ElementRef<'div'>>(null);
  const events = groupEventsByDate(props.events);
  const lastDate = new Date(props.events.at(-1)?.date!);

  return <div className="w-[21cm] h-[29.7cm] border border-black/20 p-12 flex flex-col mx-auto">

    <WeeklyPageHeader lastDate={lastDate}/>

    <div className="my-6 flex justify-center gap-4">
      <div className="text-3xl font-semibold tracking-tight">Wochenmitteilungen der drei Pfarren</div>
    </div>

    <div className="grid grid-cols-[3.5cm_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] text-sm">
      <div className="border-b border-black/20"/>
      {calendars.map(calendar =>
        <div key={calendar} className="border-l border-b border-black/20 h-full">
          <div className={`px-2 py-1 ${getCalendarInfo(calendar).borderColor} border-b-4 h-full`}>
            {getCalendarInfo(calendar).fullName}
          </div>
        </div>)}
    </div>
    <div className="overflow-hidden flex items-end text-sm">
      <div className="grid grid-cols-[3.5cm_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] leading-tight" ref={ref}>
        {Object.entries(events).map(([dateString, events]) => {
          const date = new Date(dateString)
          const liturgyElement = props.liturgy[date.toISOString().slice(0, 10)];
          const isSpecial = date.getDay() === 0 || liturgyElement?.some(l => l.rank === "H");
          const showLiturgy = ["H", "F"].includes(liturgyElement?.[0].rank) || isSpecial;

          return <div className={`contents`} key={dateString}>

            <div className={`px-2 py-0.5 border-b border-black/20 ${isSpecial ? 'bg-black/5 font-semibold' : ''}`}>
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
                className={`px-2 py-0.5 border-l border-black/20 border-b ${isSpecial ? 'bg-black/5' : ''}`}
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