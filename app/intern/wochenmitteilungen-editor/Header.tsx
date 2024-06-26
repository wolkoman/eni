import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import React from "react";
import Link from "next/link";
import {parishes} from "@/app/intern/wochenmitteilungen-editor/(events-page)/PageEvents";

export function WeeklyPageHeader1() {
  return <div className="flex justify-between">
    <div className="opacity-70 leading-snug text-xs">
      Miteinander der Pfarren Emmaus, Inzersdorf (St. Nikolaus), Inzersdorf-Neustift<br/>
      Zentralbüro: Draschestraße 105, 1230 Wien  | <u>eni.wien</u> | +43 664 886 32 680
    </div>
    <div className="flex">{parishes.map(name =>
      <img src={getCalendarInfo(name).image} key={name} className="w-14"/>
    )}</div>
  </div>;
}
export function WeeklyPageHeader2(props: { parish: CalendarName }) {
  const calendarInfo = getCalendarInfo(props.parish);
  return <div className="flex justify-between">
    <div className="opacity-70 leading-snug text-xs">
      <div>Röm.-kath. {calendarInfo.fullName}</div>
      <Link href={calendarInfo.websiteUrl}><u>{calendarInfo.websiteDisplay}</u></Link>
    </div>
    <div className="flex">
      <img src={calendarInfo.image} className="w-14"/>
    </div>
  </div>;
}

export function WeeklyPageFooter() {
  return <div className="flex justify-between leading-snug text-xs opacity-70 mt-2">
    <div>
      Für den Inhalt verantwortlich: Pfarrer Dr. Zvonko Brezovski
    </div>
  </div>;
}
