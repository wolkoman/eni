"use client"

import {Section} from "../components/Section";
import {CalendarName, getCalendarInfo} from "./(domain)/events/CalendarInfo";
import React from "react";
import {motion} from "framer-motion";
import Link from "next/link";
import {SectionHeader} from "../components/SectionHeader";

export function Personal() {
  return <>
    <SectionHeader id="personal">Unsere Priester</SectionHeader>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-24">
      <Person img="/personal/zvonko.png" name="Dr. Zvonko Brezovski" role="Pfarrer" mail="pfarrer"/>
      <Person img="/personal/marcin.png" name="Marcin Wojciech" role="Pfarrvikar" mail="pfarrvikar"/>
      <Person img="/personal/gil.png" name="Gil Vicente Thomas" role="Aushilfskaplan" mail="kaplan.e"/>
      <Person img="/personal/david.png" name="David Campos" role="Aushilfskaplan" mail="kaplan.in"/>
    </div>
  </>;
}

function Person(props: { img: string; name: string; role: string; mail: string; }) {
  return <div className="flex flex-col items-center text-center">
    <div className="rounded-lg shadow-lg aspect-square w-full lg:w-52 relative overflow-hidden">
      <div style={{backgroundImage: `url(${props.img})`}} className="absolute inset-0 bg-cover"/>
    </div>
    <div className="text-xl font-bold mt-4">{props.name}</div>
    <div className="italic">{props.role}</div>
    <div className="underline ">{props.mail}@eni.wien</div>
  </div>;
}

export function EniInformation() {
  return <><Personal/>
    <Section title="Unsere Pfarren">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
        <Parish name={CalendarName.EMMAUS} index={0}/>
        <Parish name={CalendarName.INZERSDORF} index={1}/>
        <Parish name={CalendarName.NEUSTIFT} index={2}/>
      </div>
    </Section></>;
}

function Parish(props: { name: CalendarName; index: number }) {
  const info = getCalendarInfo(props.name);
  return <div className="flex flex-col items-center text-center w-full">
    <div className={"rounded-lg overflow-hidden h-44 relative w-full " + info.className}>
      <motion.div
        style={{backgroundImage: `url(${info.image})`}}
        className="w-full h-full rounded-lg bg-contain bg-no-repeat bg-bottom"
        whileInView={{translateY: 0}}
        transition={{delay: 0.2 * props.index, bounce: 0}}
        initial={{translateY: 150}}
      />
    </div>
    <div className="text-xl font-bold mt-4">{info.fullName}</div>
    <div className="italic">{info.address}</div>
    <Link href={`${info.websiteUrl}`}>
      <div className="underline hover:no-underline cursor-pointer">{info.websiteDisplay}</div>
    </Link>
  </div>
}