import {FilterType, getMonthName, getWeekDayName} from "./Calendar";
import {LiturgyData} from "../../pages/api/liturgy";
import {useState} from "@/app/(shared)/use-state-util";
import {Settings} from "../Settings";
import {CalendarErrorNotice} from "./CalendarErrorNotice";
import {EniLoading} from "../Loading";
import {EventSearch} from "./EventSearch";
import {ReducedCalendarState} from "@/app/termine/EventPage";
import {getCalendarInfo} from "@/domain/events/CalendarInfo";

export function MonthView(props: { filter: FilterType, liturgy: LiturgyData, calendar: ReducedCalendarState }) {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(new Date());
    const getDays = (year: number, month: number) => {
        return new Date(year, month, 0).getDate();
    };
    const [year, month, day, daysInMonth] = [selected.getFullYear(), selected.getMonth(), (selected.getDay() + 1) % 7, getDays(selected.getFullYear(), selected.getMonth() + 1)];

    return <>
        <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 items-center">
                <div className="p-3 bg-black/5 rounded-lg cursor-pointer"
                     onClick={() => setSelected(d => new Date(d.setMonth(month - 1)))}>⬅️
                </div>
                <div className="font-bold text-2xl w-44 text-center">{getMonthName(month)} {year}</div>
                <div className="p-3 bg-black/5 rounded-lg cursor-pointer"
                     onClick={() => setSelected(d => new Date(d.setMonth(month + 1)))}>➡️
                </div>
                <EventSearch onChange={setSearch} filter={props.filter}/>
            </div>
            <div>
                <Settings/>
            </div>
        </div>
        {props.calendar.error && <CalendarErrorNotice/>}
        {props.calendar.loading && <EniLoading/>}
        <div className="grid grid-cols-7 gap-1">
            {Array.from({length: 7}).map((_, i) => <div>{getWeekDayName((i + 1) % 7)}</div>)}
            {Array.from({length: day}).map(() => <div></div>)}
            {Array.from({length: daysInMonth})
                .map((_, i) => ({
                    day: i + 1,
                    events: props.calendar.items
                        .filter(item => item.date === new Date(year, month, i + 2).toISOString().substring(0, 10))
                        .filter(event => !search || (event.summary + event.description).toLowerCase().includes(search.toLowerCase()))
                }))
                .map(({day, events}) => <div className="bg-black/5 p-1 rounded-lg">
                    <div className="text-right">{day}</div>
                    {events.map(event => <div className=" text-sm flex gap-1">
                        <div
                            className={getCalendarInfo(event.calendar).className + " mt-1.5 w-2 h-2 shrink-0 rounded-full"}></div>
                        <div className="line-clamp-1">{event.summary}</div>
                    </div>)}
                </div>)}
        </div>
    </>;
}
