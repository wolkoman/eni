"use client"
import Responsive from "./Responsive";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {motion, useScroll} from "framer-motion";
import {useRef} from "react";

export function EniHero() {

  return <Responsive>
    <motion.div  className="bg-cover rounded-2xl lg:-mx-20 bg flex flex-col lg:flex-row justify-between px-12 items-end text-white"
    style={{background: "url(bg-grad.svg)"}}>
        <div className="flex flex-col py-12 gap-4">
          <div className=" text-2xl">Miteinander der Pfarren</div>
          <div className="font-bold text-5xl">Emmaus, St.&nbsp;Nikolaus und Neustift</div>
        </div>
      <div className="w-52 h-52 shrink-0 bg-contain bg-bottom bg-no-repeat" style={{backgroundImage: `url(${getCalendarInfo(CalendarName.EMMAUS).image})`}}/>
      <div className="w-52 h-52 shrink-0 bg-contain bg-bottom bg-no-repeat" style={{backgroundImage: `url(${getCalendarInfo(CalendarName.INZERSDORF).image})`}}/>
      <div className="w-52 h-52 shrink-0 bg-contain bg-bottom bg-no-repeat" style={{backgroundImage: `url(${getCalendarInfo(CalendarName.NEUSTIFT).image})`}}/>
    </motion.div>
    </Responsive>;
}
