import {Calendar, CalendarEvent} from '../util/calendar-events';
import {Permission, Permissions} from '../util/verify';
import React, {useEffect, useRef} from 'react';
import {getMonthName, getWeekDayName} from './Calendar';
import {SanitizeHTML} from './SanitizeHtml';
import {getCalendarInfo} from '../util/calendar-info';

export function EventSummary(props: { event: CalendarEvent }) {
  return <>{props.event.summary}</>;
}

export function EventDescription(props: { event: CalendarEvent, permissions: Permissions }) {
  return <div className="font-normal text-sm leading-4">
    {props.permissions[Permission.PrivateCalendarAccess] && <>
      {props.event.tags.includes('private') &&
      <div className="text-xs p-0.5 m-1 bg-gray-300 inline-block rounded">🔒 Vertraulich</div>}
      {props.event.tags.includes('in-church') && props.event.calendar === 'inzersdorf' &&
      <div className="text-xs p-0.5 m-1 bg-gray-300 inline-block rounded">🎹 Orgel-Blocker</div>}
    </>}
    {!props.event.tags.includes('cancelled') && <>
      {props.event.mainPerson && `mit ${props.event.mainPerson}`}
      {props.event.description && <SanitizeHTML html={props.event.description?.replace(/\n/g, '<br/>')}/>}</>}
  </div>;
}

export function ParishTag(props: { calendar: Calendar, colorless?: boolean }) {
  const info = getCalendarInfo(props.calendar);
  return <div
    className={`w-14 text-xs leading-4 inline-block px-1 py-0.5 text-center rounded cursor-default ${props.colorless || info.className}`}>{info.tagName}</div>
}

export const EventTime = (props: { date: Date }) => {
  const hour = props.date.getHours();
  const minutes = props.date.getMinutes();
  return <>{('0' + hour).slice(-2)}:{('0' + minutes).slice(-2)}</>;
}

export function Event({event, permissions, noTag}: { event: CalendarEvent, permissions: Permissions, noTag?: boolean }) {
  return <div className={`flex text-lg mb-1 ${event.tags.includes('cancelled') && 'opacity-50'}`}>
    <div className={`w-10 flex-shrink-0 mr-2 ${event.tags.includes('cancelled') || 'font-semibold'}`}>
      {event.start.dateTime && <EventTime date={new Date(event.start.dateTime)}/>}
    </div>
    {noTag ||
    <div className="mr-2"><ParishTag calendar={event.calendar} colorless={event.tags.includes('cancelled')}/></div>}
    <div className="mb-2 leading-5" data-testid="event">
      <div className={`mt-1 ${event.tags.includes('cancelled') || 'font-semibold'}`}><EventSummary event={event}/></div>
      <div><EventDescription event={event} permissions={permissions}/></div>
    </div>
  </div>;
}

export const EventDate = ({date, setOffsetTop, filter}: { filter?: any, date: Date, setOffsetTop?: (top: number) => void }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (setOffsetTop)
      setOffsetTop((ref.current as unknown as HTMLElement).offsetTop!);
  }, [ref, filter]);
  const day = date.getDay();
  return <div className="sticky top-14 md:top-0 relative z-10">
    <div className={`mp-3 leading-5 bg-gray-back pt-4 ${day ? '' : 'underline'}`} ref={ref}>
      {getWeekDayName(day)},{' '}
      {date.getDate()}. {getMonthName(date.getMonth())}
    </div>
    <div className="h-4 to-gray-50 bg-gradient-to-t from-transparent"/>
  </div>;
}