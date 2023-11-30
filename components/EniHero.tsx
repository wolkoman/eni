"use client"
import Responsive from "./Responsive";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";

export function EniHero() {

  return <Responsive>
    <div  className="bg-cover bg-gradient-mobile lg:bg-gradient rounded-2xl xl:-mx-20 flex flex-col lg:flex-row justify-between items-end text-white">
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
