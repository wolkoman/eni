import React from "react";
import {Calendar} from "../util/calendar-events";
import {getCalendarInfo} from "../util/calendar-info";

export function Parishes() {
  return <div className=" py-6 pb-12 md:py-12">
    <div className="grid grid-cols-3 gap-4 md:gap-16">
      {(['emmaus','inzersdorf','neustift'] as Calendar[]).map(calendar => getCalendarInfo(calendar)).map(calendar => <div key={calendar.fullName}>
        <div className="flex justify-center">
          <img src={calendar.imageColor} className="pb-2 md:h-48 h-32" alt={calendar.fullName}/>
          <img src={calendar.image} className="mt-2 h-44 absolute hidden md:block" alt={calendar.fullName}/>
        </div>
        <div className="md:hidden leading-4 text-center font-semibold text-lg">{calendar.fullName}</div>
        <div className="hidden md:block">{calendar.description(calendar.fullName)}</div>
        <div className="leading-4 text-center mt-2 md:italic md:text-left">{calendar.address}</div>
      </div>)}
    </div>
  </div>;
}