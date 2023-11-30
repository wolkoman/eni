import React from 'react';
import Site from "../../components/Site";
import {Links} from "../(shared)/Links";
import {CalendarName, getCalendarInfo} from "../(domain)/events/CalendarInfo";


export default async function Page(){
    return <WochenmitteilungenSite/>
}

const WochenmitteilungenSite = () => {

    return (
      <Site title="Wochenmitteilungen">
          <div className="flex">
              <div className="">
                  <div className="text-4xl font-bold my-6 lg:my-12">
                      Wochenmitteilungen
                  </div>
                  <div className="max-w-xl my-6">
                      Gottesdienste, Veranstaltungen und Ankündigungen jede Woche neu. Sie können sich auch gerne für
                      den Newsletter registrieren: Schicken Sie dazu eine Mail mit der gewünschten Pfarre an
                      kanzlei@eni.wien.
                  </div>
                  <div className="grid lg:grid-cols-3 gap-2">
                      <WeeklyButton href={Links.Wochenmitteilungen(CalendarName.EMMAUS)} index={0} calendar={CalendarName.EMMAUS}/>
                      <WeeklyButton href={Links.Wochenmitteilungen(CalendarName.INZERSDORF)} index={1}
                            calendar={CalendarName.INZERSDORF}/>
                      <WeeklyButton href={Links.Wochenmitteilungen(CalendarName.NEUSTIFT)} index={2} calendar={CalendarName.NEUSTIFT}/>
                  </div>
              </div>
          </div>
      </Site>
    );
};

function WeeklyButton(props: { index: number, href?: string, calendar: CalendarName }) {
    const info = getCalendarInfo(props.calendar);
    return <a
      className={`block text-center font-bold rounded-lg ${info.className} overflow-hidden shadow-lg p-8 hover:opacity-90`}
      href={props.href}
    >{info.fullName}
    </a>
}
