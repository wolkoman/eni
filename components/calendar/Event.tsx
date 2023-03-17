import {CalendarEvent, CalendarTag} from "../../util/calendar-types";
import {ParishDot} from './ParishTag';
import React from "react";
import {EventDescription, EventTag} from "./EventUtils";
import {CalendarName, getCalendarInfo} from "../../util/calendar-info";
import {Diff} from "diff-match-patch";
import {Collections} from "cockpit-sdk";

export function Event({event, suggestion, ...props}: { event: Partial<CalendarEvent>, suggestion?: Collections['eventSuggestion'], small?: boolean }) {
    const cancelled = event.tags?.includes(CalendarTag.cancelled);
    const announcement = event.tags?.includes(CalendarTag.announcement);
    const info = getCalendarInfo(suggestion?.parish ?? event.calendar ?? CalendarName.ALL);
    return <>
        <div
            className={`py-1 flex text-lg ${cancelled && 'opacity-50'} ${announcement && `${info.className} rounded-lg`}`}
        >
            <div className={`pr-3 pt-1.5 shrink-0`}>
                <ParishDot info={info} small={props.small}/>
            </div>
            <div className={`w-[50px] lg:w-[40px] flex-shrink-0 mr-2 ${cancelled || 'font-semibold'}`}>
                <DiffView>{suggestion?.data.time ?? event.time ?? ""}</DiffView>
            </div>
            <div className="grow">
                <div className={`${cancelled || 'font-semibold'}`}>
                    <DiffView>{suggestion?.data.summary ?? event.summary ?? ""}</DiffView>
                </div>
                <EventDescription event={event} suggestion={suggestion}/>
            </div>
            <div className="flex gap-1" data-testid="event">
                {event.tags?.map(tag => <EventTag key={tag} tag={tag}/>)}
            </div>
        </div>
    </>;
}

export const DiffView = (props: { children: Diff[] | string }) => {
    if(!props.children) return <></>
    return <span className="whitespace-pre-wrap">{typeof props.children === "string"
        ? props.children
        : props.children.map(diff => <span className={"rounded " + {
            "-1": "bg-red-300 line-through",
            "0": "",
            "1": "bg-green-300 "
        }[diff[0]]}>{diff[1]}</span>)}</span>
}


