import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import React from "react";
import Link from "next/link";
import {parishes} from "@/app/intern/wochenmitteilungen-editor/(events-page)/PageEvents";

export function WeeklyPageHeader1() {
  return <div className="flex justify-between">
    <div className="opacity-70 leading-snug text-xs">
      Miteinder der Pfarren Emmaus, Inzersdorf (St. Nikolaus), Inzersdorf-Neustift<br/>
      eni.wien | +43 664 886 32 680
    </div>
    <div className="flex">{parishes.map(name =>
      <img src={getCalendarInfo(name).image} key={name} className="w-14"/>
    )}</div>
  </div>;
}
export function WeeklyPageHeader2(props: { parish: CalendarName }) {
  return <div className="flex justify-between border-b border-black/30">
    <div className="opacity-70 leading-snug text-xs">
      <div>{getCalendarInfo(props.parish).fullName}</div>
      <Link href="https://eni.wien"><u>eni.wien</u></Link> | +43 664 886 32 680
    </div>
    <div className="flex">
      <img src={getCalendarInfo(props.parish).image} className="w-14"/>
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
