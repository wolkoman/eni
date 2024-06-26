import Responsive from "./Responsive";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";

export function EniHero() {

  return <Responsive>
    <div  className="bg-cover bg-[linear-gradient(135deg,#2A6266,#139B91,#F4AC11)] bg-center rounded-lg flex flex-col lg:flex-row justify-between items-end text-white shadow-lg">
      <div className="flex flex-col p-8 pt-16 lg:p-16 gap-2">
        <div className="text-xl">Miteinander der Pfarren</div>
        <div className="text-4xl font-bold">Emmaus, St.&nbsp;Nikolaus und Neustift</div>
      </div>
      <div className="flex w-full h-28 lg:h-52">
        <div className="w-52 h-full lg:shrink-0 bg-contain bg-bottom bg-no-repeat" style={{backgroundImage: `url(${getCalendarInfo(CalendarName.EMMAUS).image})`}}/>
        <div className="w-52 h-full lg:shrink-0 bg-contain bg-bottom bg-no-repeat" style={{backgroundImage: `url(${getCalendarInfo(CalendarName.INZERSDORF).image})`}}/>
        <div className="w-52 h-full lg:shrink-0 bg-contain bg-bottom bg-no-repeat" style={{backgroundImage: `url(${getCalendarInfo(CalendarName.NEUSTIFT).image})`}}/>
      </div>

    </div>
  </Responsive>;
}
