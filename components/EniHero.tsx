"use client"
import Responsive from "./Responsive";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {motion} from "framer-motion";

export function EniHero() {

  return <Responsive>
    <div  className="bg-[#193765] rounded-2xl xl:-mx-20 flex flex-col lg:flex-row justify-between items-end text-white relative overflow-hidden">
      {Array.from({length: 20}).map((_, index) => {
        const rand = ((index*17 * 16807 % 2147483647) % 1000) / 10;
        const rand2 = (((index*9) * 16807 % 2147483647) % 1000) / 10;
        const rand3 = (((index*13) * 16807 % 2147483647) % 1000) / 10;
        return <motion.div
          key={index}
          style={{ left: `${rand}%`, top: `${rand2}%` }}
          className="absolute"
          initial={{ opacity: 0 }}
          animate={{scale: [0,.5,1], opacity: [0,1,0]}}
          transition={{repeatDelay: rand3/10+0.5, delay: rand3/20+0.5, repeatType: "loop", repeat: Number.MAX_SAFE_INTEGER, duration: 2}}
        >
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.3873 0.935547C16.3873 12.5397 12.0938 20.2759 0.774414 20.2759C12.0938 20.2759 16.3873 29.0669 16.3873 39.9678C16.3873 29.0669 19.9002 20.2759 32.0002 20.2759C19.5099 20.2759 16.3873 12.5397 16.3873 0.935547Z"
              fill="#F4AC11"/>
          </svg>
        </motion.div>;
      })}

      <svg width="215" height="88" viewBox="0 0 215 88" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-1/4 -translate-y-1/2 right-1/4">
        <path d="M172.271 3.55231L182.651 27.1472L208.299 24.5662L189.066 41.7296L199.447 65.3244L177.18 52.3372L157.948 69.5006L163.419 44.3106L141.152 31.3233L166.8 28.7423L172.271 3.55231Z" fill="#F4AC11"/>
        <path d="M175.49 38.8867C129.324 31.422 31.6268 44.3394 12.1967 80.9688" stroke="url(#paint0_linear_1120_357)" stroke-width="26.7769"/>
        <defs>
          <linearGradient id="paint0_linear_1120_357" x1="171.127" y1="38.9891" x2="20.2504" y2="71.113" gradientUnits="userSpaceOnUse">
            <stop stop-color="#F4AC11"/>
            <stop offset="1" stop-color="#F4AC11" stop-opacity="0"/>
          </linearGradient>
        </defs>
      </svg>

      <div className="flex flex-col p-10 lg:p-16  gap-4">
          <div className=" text-2xl">Miteinander der Pfarren</div>
          <div className="font-bold text-5xl">Emmaus, St.&nbsp;Nikolaus und Neustift</div>
        </div>
      <div className="flex w-full h-28 lg:h-52">
      <div className="w-52 h-full lg:shrink-0 bg-contain bg-bottom bg-no-repeat" style={{backgroundImage: `url(${getCalendarInfo(CalendarName.EMMAUS).image})`}}/>
      <div className="w-52 h-full lg:shrink-0 bg-contain bg-bottom bg-no-repeat" style={{backgroundImage: `url(${getCalendarInfo(CalendarName.INZERSDORF).image})`}}/>
      <div className="w-52 h-full lg:shrink-0 bg-contain bg-bottom bg-no-repeat" style={{backgroundImage: `url(${getCalendarInfo(CalendarName.NEUSTIFT).image})`}}/>
        </div>

    </div>
    </Responsive>;
}
