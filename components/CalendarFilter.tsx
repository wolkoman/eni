import {Permission, Permissions} from '../util/verify';
import {Calendar, CalendarEvent} from '../util/calendar-events';
import {getCalendarInfo} from '../util/calendar-info';
import React from 'react';

export function FilterSelector(props: { filter: FilterType, setFilter: (filter: FilterType) => void, userPermissions: Permissions }) {
  const parishFilters: { label: string, parish: Calendar }[] = [
    {label: 'Emmaus', parish: 'emmaus'},
    {label: 'St. Nikolaus', parish: 'inzersdorf'},
    {label: 'Neustift', parish: 'neustift'},
  ];
  const personFilters: { label: string, person: Person }[] = [
    {label: 'Zvonko', person: 'brezovski'},
    {label: 'David', person: 'campos'},
    {label: 'Gil', person: 'thomas'},
    {label: 'Marcin', person: 'wojciech'},
  ];
  return <>
    <div
      className="flex md:flex-col flex-row justify-around md:justify-start flex-shrink-0"
      data-testid="parish-selector">
      <div
        className="px-3 py-1 mb-1 cursor-pointer"
        onClick={() => props.setFilter(null)}>Alle
      </div>
      {parishFilters.map(filt => <div
          className="px-3 py-1 mb-1 cursor-pointer relative" key={filt.label}
          onClick={() => props.setFilter({filterType: 'PARISH', parish: filt.parish})}>
          {filt.label}
          <div
            className={`absolute bottom-0 left-0 h-0.5 transition-all ${getCalendarInfo(filt?.parish).className} bg-gray-600 ${((props.filter?.filterType === 'PARISH' && props.filter.parish === filt.parish) || props.filter === null && filt.parish === 'all') ? 'w-full opacity-100' : 'opacity-0 w-0'}`}/>
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

export type FilterType = { filterType: 'PARISH', parish: Calendar } | { filterType: 'PERSON', person: Person } | null;
export const personWords = {
  brezovski: ['Brezovski', 'Zvonko'],
  thomas: ['Thomas', 'Gil'],
  campos: ['David', 'Campos'],
  wojciech: ['Wojciech', 'Marcin']
}
export type Person = keyof typeof personWords;

export function applyFilter(events: CalendarEvent[], filter: FilterType) {
  return events
    .filter(event =>
      (filter?.filterType === 'PERSON' && personWords[filter.person].some(word => event.mainPerson?.match(word)))
      || (filter?.filterType === 'PARISH' && event.calendar === filter.parish)
      || filter === null)

}