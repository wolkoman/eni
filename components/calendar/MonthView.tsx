import {FilterType, getMonthName, getWeekDayName} from "./Calendar";
import {LiturgyData} from "../../pages/api/liturgy";
import {useState} from "@/app/(shared)/use-state-util";
import React from "react";
import {getCalendarInfo} from "@/domain/events/CalendarInfo";
import {CalendarEvent} from "@/domain/events/EventMapper";
import {ParishDot} from "./ParishDot";

export function MonthView(props: {
    search: string,
    filter: FilterType,
    liturgy: LiturgyData,
    items: CalendarEvent[]
}) {
    const [selected, setSelected] = useState(new Date());
    const getDays = (year: number, month: number) => new Date(year, month, 0).getDate();
    const [year, month, day, daysInMonth] = [selected.getFullYear(), selected.getMonth(), (selected.getDay() + 1) % 7, getDays(selected.getFullYear(), selected.getMonth() + 1)];
    const selector = true;

    return <div className=" px-6">
        <div className="flex justify-between items-center mb-6">
            {selector ? <div className="flex gap-2 items-center">
                <div className="p-3 bg-black/5 rounded-lg cursor-pointer"
                     onClick={() => setSelected(d => new Date(d.setMonth(month - 1)))}>⬅️
                </div>
                <div className="font-bold text-2xl w-44 text-center">{getMonthName(month)} {year}</div>
                <div className="p-3 bg-black/5 rounded-lg cursor-pointer"
                     onClick={() => setSelected(d => new Date(d.setMonth(month + 1)))}>➡️
                </div>
            </div> : <div/>}
        </div>
        <div className="grid grid-cols-7 gap-1">
            {Array.from({length: 7}).map((_, i) => <div>{getWeekDayName((i + 1) % 7)}</div>)}
            {Array.from({length: day}).map(() => <div></div>)}
            {Array.from({length: daysInMonth})
              .map((_, i) => ({
                  day: i + 1,
                  events: props.items
                    .filter(item => item.date === new Date(year, month, i + 2).toISOString().substring(0, 10))
              }))
              .map(({day, events}) => <div className="bg-black/5 px-1 rounded-lg overflow-hidden">
                  <div className="text-right">{day}</div>
                  <div className="relative overflow-auto h-32">
                      {events.map(event => <div className=" text-sm flex gap-1">
                          <div className="shrink-0 scale-75">
                              <ParishDot info={getCalendarInfo(event.calendar)} private={false} small={true}/>
                          </div>
                          <div className="overflow-hidden">
                                <span title={event.summary} className="line-clamp-1 break-all visible"><span
                                  className="text-black/50 mr-1">{event.time}</span> {event.summary}</span>
                          </div>
                      </div>)}
                  </div>
              </div>)}
        </div>
    </div>;
}
