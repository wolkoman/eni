import {useRouter} from 'next/router';
import {SanitizeHTML} from '../SanitizeHtml';
import {Permission, Permissions} from '../../util/verify';
import {Calendar, CalendarEvent} from '../../util/calendar-events';
import {getCalendarInfo} from '../../util/calendar-info';

const personWords = {
  brezovski: ['Brezovski', 'Zvonko'],
  thomas: ['Thomas', 'Gil'],
  campos: ['David', 'Campos'],
  wojciech: ['Wojciech', 'Marcin']
}
type Person = keyof typeof personWords;

export function FilterSelector(props: { filter: FilterType, setFilter: (filter: FilterType) => void, userPermissions: Permissions}) {
  const parishFilters: {label: string, parish: Calendar}[] = [
    {label: 'Emmaus', parish: 'emmaus'},
    {label: 'St. Nikolaus', parish: 'inzersdorf'},
    {label: 'Neustift', parish: 'neustift'},
  ];
  const personFilters: {label: string, person: Person}[] = [
    {label: "Zvonko", person: 'brezovski'},
    {label: "David", person: 'campos'},
    {label: "Gil", person: 'thomas'},
    {label: "Marcin", person: 'wojciech'},
  ];
  return <>
    <div
      className="flex md:flex-col flex-row justify-around md:justify-start flex-shrink-0"
      data-testid="parish-selector">
      <div
        className="px-3 py-1 hover:bg-gray-200 mb-1 cursor-pointer"
        onClick={() => props.setFilter(null)}>Alle</div>
      {parishFilters.map(filt => <div
          className="px-3 py-1 mb-1 cursor-pointer relative" key={filt.label}
          onClick={() => props.setFilter({filterType: 'PARISH', parish: filt.parish})}>
          {filt.label}
          <div className={`absolute bottom-0 left-0 h-0.5 transition-all ${getCalendarInfo(filt?.parish).className} bg-gray-600 ${((props.filter?.filterType === 'PARISH' && props.filter.parish === filt.parish) || props.filter === null && filt.parish === 'all') ? 'w-full opacity-100' : 'opacity-0 w-0'}`}/>
        </div>
      )}
    </div>
    {props.userPermissions[Permission.PrivateCalendarAccess] && <div
      className="flex md:flex-col flex-row justify-around md:justify-start flex-shrink-0"
      data-testid="parish-selector">
      {personFilters.map(filt => <div
          className="px-3 py-1 mb-1 cursor-pointer relative" key={filt.label}
          onClick={() => props.setFilter({filterType: 'PERSON', person: filt.person})}>
          {filt.label}
        </div>
      )}
    </div>}
  </>;
}

export function ParishTag(props: { calendar: Calendar, colorless?: boolean }) {
  const info = getCalendarInfo(props.calendar);
  return <div className={`w-14 text-xs leading-4 inline-block px-1 py-0.5 text-center rounded cursor-default ${props.colorless || info.className}`}>{info.tagName}</div>
}

export function Event({event, permissions, noTag}: { event: CalendarEvent, permissions: Permissions, noTag?: boolean }) {
  return <div className={`flex text-lg mb-1 ${event.tags.includes("cancelled") && 'opacity-50'}`}>
    <div className={`w-10 flex-shrink-0 mr-2 ${event.tags.includes("cancelled") || 'font-semibold'}`}>
      {event.start.dateTime && <EventTime date={new Date(event.start.dateTime)}/>}
    </div>
    {noTag || <div className="mr-2"><ParishTag calendar={event.calendar} colorless={event.tags.includes("cancelled")}/></div>}
    <div className="mb-2 leading-5" data-testid="event">
      <div className={`mt-1 ${event.tags.includes("cancelled") || 'font-semibold'}`}><EventSummary event={event}/></div>
      <div><EventDescription event={event} permissions={permissions}/></div>
    </div>
  </div>;
}

export function EventSummary(props: {event: CalendarEvent}){
  const router = useRouter();
  const liturgy = props.event.tags.includes("liturgy") && false;
  return <span
    className={`${liturgy && 'underline hover:no-underline cursor-pointer'}`}
    onClick={liturgy ? () => router.push(`/termine/${props.event.id}`) : () => {}}
  >
    {props.event.summary}
  </span>;
}
export function EventDescription(props: {event: CalendarEvent, permissions: Permissions}){
  return <div className="font-normal text-sm leading-4">
    {props.permissions[Permission.PrivateCalendarAccess] && <>
    {props.event.tags.includes('private') && <div className="text-xs p-0.5 m-1 bg-gray-300 inline-block rounded">🔒 Vertraulich</div>}
    {props.event.tags.includes('in-church') && props.event.calendar === 'inzersdorf' && <div className="text-xs p-0.5 m-1 bg-gray-300 inline-block rounded">🎹 Orgel-Blocker</div>}
    </>}
    {!props.event.tags.includes("cancelled") && <>
      {props.event.mainPerson && `mit ${props.event.mainPerson}`}
      {props.event.description && <SanitizeHTML html={props.event.description?.replace(/\n/g, '<br/>')}/>}</>}
  </div>;
}

export type FilterType = { filterType: 'PARISH', parish: Calendar } | { filterType: 'PERSON', person: Person } | null;

export function applyFilter(events: CalendarEvent[], filter: FilterType) {
  return events
    .filter(event =>
      (filter?.filterType === 'PERSON' && personWords[filter.person].some(word => event.mainPerson?.match(word)))
      || (filter?.filterType === 'PARISH' && event.calendar === filter.parish)
      || filter === null)

}

export const LoadingEvents = () => <>
  <ShadowEventDate/>
  {[120, 100, 150].map((width, index) => <ShadowEvent key={index} width={width} description={index===0}/>)}
  <ShadowEventDate/>
  {[180, 120].map((width, index) => <ShadowEvent key={index} width={width} description={index===2}/>)}
  <ShadowEventDate/>
  {[120, 100, 150].map((width, index) => <ShadowEvent key={index} width={width} description={index===1}/>)}
</>
const ShadowEventDate = () => <div className="w-36 h-4 mb-1.5 mt-4 shimmer"/>
const ShadowEvent = ({width, description}: { width: number, description: boolean }) => <div className="flex mb-3">
  <div className="w-10 h-5 shimmer mr-2"/>
  <div className="w-14 h-5 shimmer mr-2"/>
  <div>
    <div className="h-5 shimmer mr-2" style={{width}}/>
    <div className="h-3 shimmer mt-0.5" style={{width, display: description ? '':'none'}}/>
    <div className="h-3 shimmer mt-0.5" style={{width: width / 2, display: description ? '':'none'}}/>
  </div>
</div>

export function getWeekDayName(day: number) {
  return ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][day];
}
export function getMonthName(month: number) {
  return ['Jänner','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'][month];
}

export const EventDate = ({date}: { date: Date }) => {
  const day = date.getDay();
  return <div className="sticky top-14 md:top-0 relative z-10">
    <div className={`mp-3 leading-5 bg-gray-back pt-4 ${day ? '' : 'underline'}`}>
      <EventDateText date={date}/>
    </div>
    <div className="h-4 to-gray-50 bg-gradient-to-t from-transparent"/>
  </div>;
}

export const EventDateText = ({date}: { date: Date }) => {
  const day = date.getDay();
  return <>
      {getWeekDayName(day)},{' '}
      {date.getDate()}. {getMonthName(date.getMonth())}
  </>;
}

export const EventTime = (props: { date: Date }) => {
  const hour = props.date.getHours();
  const minutes = props.date.getMinutes();
  return <>{('0' + hour).slice(-2)}:{('0' + minutes).slice(-2)}</>;
}