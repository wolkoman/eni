import React from "react";

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
  imageColor: string,
  description: (x: string) => React.ReactNode,
}
export enum CalendarName{
  ALL = 'all',
  EMMAUS = 'emmaus',
  INZERSDORF = 'inzersdorf',
  NEUSTIFT = 'neustift',
  INZERSDORF_ORGAN = 'inzersdorf-organ',
};
export const CALENDAR_INFOS: Record<CalendarName, CalendarInfo> = {
  [CalendarName.ALL]: {
    id: CalendarName.ALL,
    calendarId: 'admin@tesarekplatz.at',
    className: '',
    borderColor: '',
    fullName: '',
    shortName: '',
    tagName: '',
    address: '',
    websiteUrl: 'https://eni.wien',
    websiteDisplay: 'https://eni.wien',
    description: () => '',
    image: '',
    imageColor: ''
  },
  [CalendarName.EMMAUS]: {
    id: CalendarName.EMMAUS,
    borderColor: 'border-emmaus',
    calendarId: 'u08nlhov79dkit0ffi993o6tuk@group.calendar.google.com',
    className: 'bg-emmaus text-white',
    fullName: 'Pfarre Emmaus am Wienerberg',
    shortName: 'Emmaus',
    tagName: 'Emmaus',
    address: 'Tesarekplatz 2, 1100 Wien',
    image: '/parish/emmaus.svg',
    imageColor: '/logos_Emmaus Fade.svg',
    websiteUrl: 'https://emmaus.wien/',
    websiteDisplay: 'emmaus.wien',
    description: (x: string) => <>Die <b>{x}</b> wurde aus den Überresten der ehemaligen Wienerberger Ziegelfabrik
      errichtet.</>,
  },
  [CalendarName.INZERSDORF]: {
    id: CalendarName.INZERSDORF,
    calendarId: '4fgiuth4nbbi5uqfa35tidnl84@group.calendar.google.com',
    className: 'bg-inzersdorf text-white',
    borderColor: 'border-inzersdorf',
    fullName: 'Pfarre Inzersdorf (St. Nikolaus)',
    shortName: 'St. Nikolaus',
    tagName: 'Nikolaus',
    address: 'Inzersdorf Kirchenplatz 1, 1230 Wien',
    image: '/parish/inzersdorf.svg',
    imageColor: '/logos_Inzersdorf Fade.svg',
    websiteUrl: 'https://pfarresanktnikolaus.at',
    websiteDisplay: 'pfarresanktnikolaus.at',
    description: (x: string) => <>Die <b>{x}</b> ist mit dem Gründungsjahr 1217 eine der ältesten Pfarren der
      Erzdiözese Wien.</>,
  },
  [CalendarName.NEUSTIFT]: {
    id: CalendarName.NEUSTIFT,
    calendarId: 'occ77f3f7sderl9e3b4jdnr5ek@group.calendar.google.com',
    className: 'bg-neustift',
    borderColor: 'border-neustift',
    fullName: 'Pfarre Inzersdorf - Neustift',
    shortName: 'Neustift',
    tagName: 'Neustift',
    address: 'Don-Bosco-Gasse 14, 1230 Wien',
    image: '/parish/neustift.svg',
    imageColor: '/logos_Neustift Fade.svg',
    websiteUrl: 'https://www.erzdioezese-wien.at/pages/pfarren/9233',
    websiteDisplay: 'pfarreinzersdorfneustift.at',
    description: (x: string) => <>Die <b>{x}</b> entstand aus einer Teilung von der Pfarre Inzersdorf und wurde Maria,
      Hilfe der Christen geweiht.</>,
  },
  [CalendarName.INZERSDORF_ORGAN]: {
    id: CalendarName.INZERSDORF_ORGAN,
    calendarId: '3i1uurj6bgl1q91l1peejmfa80@group.calendar.google.com',
    className: 'bg-inzersdorf',
    fullName: '',
    borderColor: 'border-inzersdorf',
    shortName: '',
    tagName: '',
    address: '',
    websiteUrl: '',
    websiteDisplay: '',
    description: () => '',
    image: '',
    imageColor: ''
  },
};

export const getCalendarInfo = (calendar: CalendarName): CalendarInfo => {
  return CALENDAR_INFOS[calendar];
};