import {ParishDot} from './ParishTag';
import React from "react";
import {EventDescription, EventTag} from "./EventUtils";
import {Diff} from "diff-match-patch";
import {Collections} from "cockpit-sdk";
import {CalendarEvent, CalendarTag} from "../../app/termine/EventMapper.server";
import {CalendarName, getCalendarInfo} from "../../app/termine/CalendarInfo";

export function Event({event, suggestion, ...props}: { event: Partial<CalendarEvent>, suggestion?: Collections['eventSuggestion'], small?: boolean }) {
    const cancelled = event.tags?.includes(CalendarTag.cancelled);
    const info = getCalendarInfo(suggestion?.parish ?? event.calendar ?? CalendarName.ALL);
    return <>
        <div
            className={`py-1 flex text-lg ${cancelled && 'opacity-50'}  leading-6`}
        >
            <div className={`pr-3 pt-1.5 shrink-0 ${props.small ? "w-[40px]" : "w-[100px] lg:w-[110px]"}`}>
                <ParishDot info={info} small={props.small}/>
            </div>
            <div className={`${props.small ? "w-[50px]" : "w-[50px] lg:w-[60px]"} flex-shrink-0 mr-2 font-semibold ${cancelled && 'line-through'}`}>
                <DiffView>{suggestion?.data.time ?? event.time ?? ""}</DiffView>
            </div>
            <div className="grow">
                <div className={`font-semibold ${cancelled && 'line-through'}`}>
                    <DiffView>{suggestion?.data.summary ?? event.summary ?? ""}</DiffView>
                </div>
                <EventDescription event={event} suggestion={suggestion}/>
            </div>
            <div className="flex gap-1" data-testid="event">
                {event.tags?.filter(tag => tag !== CalendarTag.announcement && tag !== CalendarTag.cancelled).map(tag => <EventTag key={tag} tag={tag}/>)}
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


