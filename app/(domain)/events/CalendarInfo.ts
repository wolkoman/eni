export enum CalendarName {
  EMMAUS = 'emmaus',
}

export const CALENDAR_INFOS: Record<CalendarName, CalendarInfo> = {
  [CalendarName.EMMAUS]: {
    id: CalendarName.EMMAUS,
    borderColor: 'border-emmaus',
    calendarId: 'u08nlhov79dkit0ffi993o6tuk@group.calendar.google.com',
    className: 'bg-emmaus text-white',
    fullName: 'Pfarre Emmaus am Wienerberg',
    shortName: 'Emmaus',
    tagName: 'Emmaus',
    address: 'Tesarekplatz 2, 1100 Wien',
    image: '/logo/parish_emmaus.svg',
    websiteUrl: 'https://emmaus.wien/',
    websiteDisplay: 'emmaus.wien',
    dot: '/dot/edot.svg',
  },
};
export const getCalendarInfo = (calendar: CalendarName): CalendarInfo => {
  return CALENDAR_INFOS[calendar];
};

export interface CalendarInfo {
  id: CalendarName,
  calendarId: string,
  borderColor: string,
  className: string,
  fullName: string,
  shortName: string,
  tagName: string,
  address: string,
  image: string,
  websiteUrl: string,
  websiteDisplay: string,
  dot: string,
}
