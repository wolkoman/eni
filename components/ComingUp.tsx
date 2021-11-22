import React from 'react';
import {useCalendarStore, useUserStore} from '../util/store';
import {SectionHeader} from './SectionHeader';
import {EventDate, EventDescription, EventSummary, EventTime} from "./Calendar";
import {getCalendarInfo} from "../util/calendar-info";
import {Permission} from '../util/verify';

export function ComingUpComponent({}) {
  const calendar = useCalendarStore(state => state);
  const user = useUserStore(state => state);
  const event = Object.values(calendar.items).flat().find(event => event.summary.match(/(Gottesdienst)|(Messe)/))!;

  if(!event || calendar.error || !user.permissions[Permission.ExperimentalAccess]) return <></>;
  return <div data-testid="coming-up" className="mb-12">
    <SectionHeader>Nächster Gottesdienst</SectionHeader>
    <div className="bg-gray-100 px-8 py-4 rounded-xl">
      <EventDate date={new Date(event.date)}/> um <EventTime date={new Date(event.start.dateTime)}/> Uhr
      <div>{getCalendarInfo(event.calendar).fullName}</div>
    </div>
  </div>;
}
