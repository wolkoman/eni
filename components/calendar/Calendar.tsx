import {Calendar, CalendarEvent} from '../../util/calendar-events';

const personWords = {
  brezovski: ['Brezovski', 'Zvonko'],
  thomas: ['Thomas', 'Gil'],
  campos: ['David', 'Campos'],
  wojciech: ['Wojciech', 'Marcin']
}
export type Person = keyof typeof personWords;

export type FilterType = { filterType: 'PARISH', parish: Calendar } | { filterType: 'PERSON', person: Person } | null;

export function applyFilter(events: CalendarEvent[], filter: FilterType, group?: string) {
  return events
    .filter(event =>
        ((filter?.filterType === 'PERSON' && personWords[filter.person].some(word => event.mainPerson?.match(word)))
      || (filter?.filterType === 'PARISH' && (event.calendar === filter.parish || event.calendar == "all"))
      || (filter === null)) && ((event.groups.includes(decodeURI(group ?? ""))) || group === undefined))

}

export const LoadingEvents = () => <div className="animate-pulse">
  <ShadowEventDate/>
  {[120, 100, 150].map((width, index) => <ShadowEvent key={index} width={width} description={index===0}/>)}
  <ShadowEventDate/>
  {[180, 120].map((width, index) => <ShadowEvent key={index} width={width} description={index===2}/>)}
</div>
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

