import {Calendar} from "./calendar-events";
import React from "react";

export interface CalendarInfo {
  id: Calendar,
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

export const getCalendarInfo = (calendar: Calendar): CalendarInfo => {
  let infos: Record<Calendar, CalendarInfo> = {
    'all': {
      id: 'all',
      className: 'bg-lndk text-white',
      borderColor: '',
      fullName: '',
      shortName: '',
      tagName: 'LNdK',
      address: '',
      websiteUrl: 'https://eni.wien',
      websiteDisplay: 'https://eni.wien',
      description: () => '',
      image: '',
      imageColor: ''
    },
    'emmaus': {
      id: 'emmaus',
      borderColor: 'border-emmaus',
      className: 'bg-emmaus text-white',
      fullName: 'Pfarre Emmaus am Wienerberg',
      shortName: 'Emmaus',
      tagName: 'Emmaus',
      address: 'Tesarekplatz 2, 1100 Wien',
      image: '/logos_Emmaus Stroke.svg',
      imageColor: '/logos_Emmaus Fade.svg',
      websiteUrl: 'https://tesarekplatz.at',
      websiteDisplay: 'tesarekplatz.at',
      description: (x: string) => <>Die <b>{x}</b> wurde aus den Überresten der ehemaligen Wienerberger Ziegelfabrik
        errichtet.</>,
    },
    'inzersdorf': {
      id: 'inzersdorf',
      className: 'bg-inzersdorf text-white',
      borderColor: 'border-inzersdorf',
      fullName: 'Pfarre Inzersdorf (St. Nikolaus)',
      shortName: 'St. Nikolaus',
      tagName: 'Nikolaus',
      address: 'Inzersdorf Kirchenplatz 1, 1230 Wien',
      image: '/logos_Inzersdorf Stroke.svg',
      imageColor: '/logos_Inzersdorf Fade.svg',
      websiteUrl: 'https://pfarresanktnikolaus.at',
      websiteDisplay: 'pfarresanktnikolaus.at',
      description: (x: string) => <>Die <b>{x}</b> ist mit dem Gründungsjahr 1217 eine der ältesten Pfarren der
        Erzdiözese Wien.</>,
    },
    'neustift': {
      id: 'neustift',
      className: 'bg-neustift',
      borderColor: 'border-neustift',
      fullName: 'Pfarre Inzersdorf - Neustift',
      shortName: 'Neustift',
      tagName: 'Neustift',
      address: 'Don-Bosco-Gasse 14, 1230 Wien',
      image: '/logos_Neustift Stroke.svg',
      imageColor: '/logos_Neustift Fade.svg',
      websiteUrl: 'https://www.erzdioezese-wien.at/pages/pfarren/9233',
      websiteDisplay: 'pfarreinzersdorfneustift.at',
      description: (x: string) => <>Die <b>{x}</b> entstand aus einer Teilung von der Pfarre Inzersdorf und wurde Maria,
        Hilfe der Christen geweiht.</>,
    },
    'inzersdorf-organ': {
      id: 'inzersdorf-organ',
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
  return infos[calendar];
};