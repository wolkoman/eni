import {CalendarInfo, CalendarName, getCalendarInfo} from '../../util/calendar-info';
import {Tooltip} from "./EventUtils";
import React from "react";

export function ParishTag(props: { calendar: CalendarName, colorless?: boolean }) {
    const info = getCalendarInfo(props.calendar);
    return <div
        className={`w-24 leading-4 inline-block p-2 text-center rounded-r-lg cursor-default ${props.colorless || info.className}`}>{info.tagName}</div>
}

export function ParishDot({info}: { info: CalendarInfo }) {
    return <Tooltip tip={info?.fullName}>
        <div className={"flex "}>
            <img src={info?.dot} className="w-6 -mt-1 relative"/>
            <div className={ info.className + " text-sm -ml-3 -mt-1 pl-4 pr-2 h-6 rounded-r-full flex items-center font-bold"}>{info.tagName}</div>
        </div>
    </Tooltip>;
}