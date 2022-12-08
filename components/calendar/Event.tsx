import { useRouter } from 'next/router';
import { CalendarEvent, CalendarGroup, CalendarTag } from "../../util/calendar-types";
import { SanitizeHTML } from '../SanitizeHtml';
import { getMonthName, getWeekDayName } from './Calendar';
import { ParishTag } from './ParishTag';

export function Event({event, noTag}: { event: CalendarEvent, noTag?: boolean }) {
    const link = event.groups.includes(CalendarGroup.Messe) ? `termine/${event.id}` : null;
    return <div className={`flex text-lg mb-1 ${event.tags.includes(CalendarTag.cancelled) && 'opacity-50'}`}>
        <div className={`w-10 flex-shrink-0 mr-2 ${event.tags.includes(CalendarTag.cancelled) || 'font-semibold'}`}>
            {event.start.dateTime && <EventTime date={new Date(event.start.dateTime)}/>}
        </div>
        {noTag || <div className="mr-2">
            <ParishTag calendar={event.calendar} colorless={event.tags.includes(CalendarTag.cancelled)}/>
        </div>}
        <div className="mb-2 leading-5" data-testid="event">
            <div className={`mt-1 ${event.tags.includes(CalendarTag.cancelled) || 'font-semibold'}`}>
                <EventSummary event={event}/>
            </div>
            <EventDescription event={event}/>
        </div>
    </div>;
}

export function EventSummary(props: { event: CalendarEvent }) {
    const router = useRouter();
    const liturgy = false;
    return <span
        className={`${liturgy && 'underline hover:no-underline cursor-pointer'}`}
        onClick={liturgy ? () => router.push(`/termine/${props.event.id}`) : () => {
        }}
    >
    {props.event.summary}
  </span>;
}

export function EventDescription(props: { event: CalendarEvent }) {
    return <div className="font-normal text-sm leading-4">
        <div>
            {props.event.tags.includes(CalendarTag.private) &&
                <div className="text-xs p-0.5 m-1 bg-gray-300 inline-block rounded">🔒 Vertraulich</div>}
            {props.event.tags.includes(CalendarTag.inChurch) && props.event.calendar === 'inzersdorf' &&
                <div className="text-xs p-0.5 m-1 bg-gray-300 inline-block rounded">🎹 Orgel-Blocker</div>}
        </div>
        {!props.event.tags.includes(CalendarTag.cancelled) && <>
            {props.event.mainPerson && `mit ${props.event.mainPerson}`}
            {props.event.description && <SanitizeHTML html={props.event.description?.replace(/\n/g, '<br/>')}/>}</>}
    </div>;
}

export const EventDate = ({date}: { date: Date }) => {
    const day = date.getDay();
    return <div className="">
        <div className={`leading-5 text-lg bg-white py-2 ${day ? '' : 'underline'}`}>
            <EventDateText date={date}/>
        </div>
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