"use client"

import React from "react";
import {CalendarName, getCalendarInfo} from "../../util/calendar-info";
import {motion} from "framer-motion";
import Site from "../../components/Site";

export const MyPdfViewer = () => {

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
            <Page href="/api/weekly?parish=emmaus" index={0} calendar={CalendarName.EMMAUS}/>
            <Page href="/api/weekly?parish=inzersdorf" index={1} calendar={CalendarName.INZERSDORF}/>
            <Page href="/api/weekly?parish=neustift" index={2} calendar={CalendarName.NEUSTIFT}/>
          </div>
        </div>
      </div>
    </Site>
  );
};

function Page(props: { index: number, href?: string, calendar: CalendarName }) {
  const info = getCalendarInfo(props.calendar);
  return <motion.a
    className={`block text-center font-bold rounded-lg ${info.className} overflow-hidden shadow-lg p-8 hover:opacity-90`}
    href={props.href}
  >{info.fullName}
  </motion.a>
}