import {CALENDAR_INFO} from "@/domain/events/CalendarInfo";
import React from "react";
import Link from "next/link";

export function WeeklyPageHeader() {
  const calendarInfo = CALENDAR_INFO;
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
