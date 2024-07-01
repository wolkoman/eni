import {EventDescription} from "./EventUtils";
import {Diff} from "diff-match-patch";
import {Collections} from "cockpit-sdk";
import {CalendarEvent, CalendarTag} from "@/domain/events/EventMapper";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";

export function Event({event, suggestion, small}: {
    event: Partial<CalendarEvent>,
    suggestion?: Collections['eventSuggestion'],
    small?: boolean
}) {
    const cancelled = event.tags?.includes(CalendarTag.cancelled);
    const info = getCalendarInfo(suggestion?.parish ?? event.calendar ?? CalendarName.ALL);
    return <>
        <div className={`py-1 flex gap-2 ${cancelled && 'opacity-50'} leading-6`}>
            <div
                className={`flex-shrink-0 font-semibold ${cancelled && 'line-through'}`}>
                <DiffView>{suggestion?.data.time ?? event.time ?? ""}</DiffView>
            </div>
            <div className="grow">
                <div className={`font-semibold ${cancelled && 'line-through'} pb-0.5`}>
                    <DiffView>{suggestion?.data.summary ?? event.summary ?? ""}</DiffView>
                </div>
                <EventDescription event={event} suggestion={suggestion}/>
            </div>
        </div>
    </>;
}

export const DiffView = (props: { children: Diff[] | string }) => {
    if (!props.children) return <></>
    return <span className="whitespace-pre-wrap">{typeof props.children === "string"
        ? props.children
        : props.children.map(diff => <span className={"rounded " + {
            "-1": "bg-red-300 line-through",
            "0": "",
            "1": "bg-green-300 "
        }[diff[0]]}>{diff[1]}</span>)}</span>
}


