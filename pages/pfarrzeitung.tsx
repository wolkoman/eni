import React from 'react';
import Site from '../components/Site';
import Link from 'next/link';
import {CalendarInfo, getCalendarInfo} from '../util/calendar-info';

function Pfarrblatt(props: { calendarInfo: CalendarInfo, href: string, label:string }) {
  return <Link href={props.href}>
    <div className={`${props.calendarInfo.className} p-6 rounded-xl cursor-pointer shadow`}>
      <div className="uppercase mb-4 text-sm">{props.calendarInfo.fullName}</div>
      <div className="text-3xl font-serif">{props.label}</div>
    </div>
  </Link>;
}

export default function HomePage() {
  const info = ['emmaus','inzersdorf','neustift'].map((x:any) => getCalendarInfo(x));
  return <Site title="Pfarrzeitungen">
    <div>
      Ausführliche Berichte zum Pfarrleben, Diskussionen zur Weltkirche, Impulse zum Nachdenken und vieles mehr
      finden Sie in den Pfarrzeitungen der Pfarren.
    </div>
    <div className="grid md:grid-cols-3 gap-4 my-12 h-80">
      <Pfarrblatt calendarInfo={info[0]} label="Der Emmausbote" href="https://tesarekplatz.at/aktuell/emmausbote"/>
      <Pfarrblatt calendarInfo={info[1]} label="Blickpunkt" href="https://www.pfarresanktnikolaus.at/wp/?page_id=89"/>
      <Pfarrblatt calendarInfo={info[2]} label="Inzersdorf-Neustift News" href="https://www.erzdioezese-wien.at/pages/pfarren/9233/pfarrblatt"/>
    </div>
  </Site>
}