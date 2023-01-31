import {CalendarInfo, CalendarName, getCalendarInfo} from '../../util/calendar-info';
import {Tooltip} from "./EventUtils";
import React from "react";

export function ParishTag(props: { calendar: CalendarName, colorless?: boolean }) {
    const info = getCalendarInfo(props.calendar);
    return <div
        className={`w-18 text-xs leading-4 inline-block px-2 py-0.5 text-center rounded-full cursor-default ${props.colorless || info.className}`}>{info.tagName}</div>
}

export function ParishTag2(props: { calendar: CalendarName, colorless?: boolean }) {
    const info = getCalendarInfo(props.calendar);
    return <div
        className={`w-24 leading-4 inline-block p-2 text-center rounded-r-lg cursor-default ${props.colorless || info.className}`}>{info.tagName}</div>
}

export function ParishTag3({info}: { info: CalendarInfo }) {
    return <Tooltip tip={info.fullName}><div className={`w-4 aspect-square font-bold grid place-items-center rounded-full cursor-default ${info.className}`}/></Tooltip>;
}