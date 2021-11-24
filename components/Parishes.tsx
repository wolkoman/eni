import React from "react";
import {Calendar} from "../util/calendar-events";
import {getCalendarInfo} from "../util/calendar-info";
import {SectionHeader} from './SectionHeader';

export function Parishes() {
  return <div className="py-6 pb-12 md:py-12">
    <SectionHeader>Unsere Pfarren</SectionHeader>
    <div className="grid sm:grid-cols-3 gap-4">
      {(['emmaus','inzersdorf','neustift'] as Calendar[]).map(calendar => getCalendarInfo(calendar)).map(calendar => <div key={calendar.fullName} className={`shadow-lg rounded-lg overflow-hidden flex sm:flex-col`}>
        <div className={`flex ${calendar.className}`}>
          <div className={`flex justify-center items-end from-white to-transparent bg-gradient-to-l sm:bg-gradient-to-t w-full`}>
            <img src={calendar.image} className="w-32 sm:h-48 sm:w-auto" alt={calendar.fullName}/>
          </div>
        </div>
        <div className="p-4 flex flex-col justify-center">
          <div className="md:hidden leading-4 text-center font-semibold text-lg">{calendar.fullName}</div>
          <div className="hidden md:block">{calendar.description(calendar.fullName)}</div>
          <div className="leading-4 text-center mt-2 italic md:text-left">{calendar.address}</div>
        </div>
      </div>)}
    </div>
  </div>;
}