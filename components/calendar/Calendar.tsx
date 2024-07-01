import {CalendarEvent} from "@/domain/events/EventMapper";
import {CalendarGroup} from "@/domain/events/CalendarGroup";

export type FilterType =  { filterType: 'GROUP', group: CalendarGroup } | null;

export function applyFilter<T extends CalendarEvent>(events: T[], filter: FilterType) {
  return events
    .filter(event =>
      (filter?.filterType === 'GROUP' && event.groups?.includes(filter.group))
      || (filter === null))

}


const ShadowEventDate = () => <div className="w-36 h-4 mb-1.5 mt-4 rounded bg-black/10"/>
export const ShadowEvent = ({width, description}: { width: number, description?: boolean }) => <div className="flex mb-3">
  <div className="w-10 h-5 bg-black/10 rounded mr-2"/>
  <div className="w-14 h-5 bg-black/20 rounded mr-2"/>
  <div>
    <div className="h-5 bg-black/10 rounded mr-2" style={{width}}/>
    <div className="h-3 bg-black/10 rounded mt-0.5" style={{width, display: description ? '':'none'}}/>
    <div className="h-3 bg-black/10 rounded mt-0.5" style={{width: width / 2, display: description ? '':'none'}}/>
  </div>
</div>

export function getWeekDayName(day: number) {
  return ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][day];
}
export function getMonthName(month: number) {
  return ['Jänner','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'][month];
}

