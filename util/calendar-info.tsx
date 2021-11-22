import {Calendar} from "./calendar-events";
import React from "react";

export interface CalendarInfo {
  className: string,
  fullName: string,
  shortName: string,
  tagName: string,
  address: string,
  image: string,
  imageColor: string,
  description: (x: string) => React.ReactNode,
}

export const getCalendarInfo = (calendar: Calendar): CalendarInfo => {
  let infos: Record<Calendar, CalendarInfo> = {
    'all': {
      className: '',
      fullName: '',
      shortName: '',
      tagName: '',
      address: '',
      description: () => '',
      image: '',
      imageColor: ''
    },
    'emmaus': {
      className: 'bg-primary1 text-white',
      fullName: 'Pfarre Emmaus am Wienerberg',
      shortName: 'Emmaus',
      tagName: 'Emmaus',
      address: 'Tesarekplatz 2, 1100 Wien',
      image: '/logos_Emmaus Stroke.svg',
      imageColor: '/logos_Emmaus Fade.svg',
      description: (x: string) => <>Die <b>{x}</b> wurde aus den Überresten der ehemaligen Wienerberger Ziegelfabrik
        errichtet.</>,
    },
    'inzersdorf': {
      className: 'bg-primary2 text-white',
      fullName: 'Pfarre Inzersdorf (St. Nikolaus)',
      shortName: 'St. Nikolaus',
      tagName: 'Nikolaus',
      address: 'Inzersdorf Kirchenplatz 1, 1230 Wien',
      image: '/logos_Inzersdorf Stroke.svg',
      imageColor: '/logos_Inzersdorf Fade.svg',
      description: (x: string) => <>Die <b>{x}</b> ist mit dem Gründungsjahr 1217 eine der ältesten Pfarren der
        Erzdiözese Wien.</>,
    },
    'neustift': {
      className: 'bg-primary3',
      fullName: 'Pfarre Inzersdorf - Neustift',
      shortName: 'Neustift',
      tagName: 'Neustift',
      address: 'Don-Bosco-Gasse 14, 1230 Wien',
      image: '/logos_Neustift Stroke.svg',
      imageColor: '/logos_Neustift Fade.svg',
      description: (x: string) => <>Die <b>{x}</b> entstand aus einer Teilung von der Pfarre Inzersdorf und wurde Maria,
        Hilfe der Christen geweiht.</>,
    },
    'inzersdorf-organ': {
      className: 'bg-primary3',
      fullName: '',
      shortName: '',
      tagName: '',
      address: '',
      description: () => '',
      image: '',
      imageColor: ''
    },
  };
  return infos[calendar];
};