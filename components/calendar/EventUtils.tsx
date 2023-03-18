import {getMonthName, getWeekDayName} from "./Calendar";
import {CalendarEvent, CalendarTag} from "../../util/calendar-types";
import React, {ReactNode} from "react";
import {DiffView} from "./Event";
import {Collections} from "cockpit-sdk";
import {roleToString} from "../../util/reader";

export function Tooltip(props: { tip: string, children: ReactNode }) {
    return <div>
        <div className="group relative">
            {props.children}
            <div
                className="hidden group-hover:block z-20 text-sm absolute left-0 bottom-0 translate-y-full bg-gray-200 shadow-lg rounded px-3 py-1 whitespace-nowrap">
                {props.tip}
            </div>
        </div>
    </div>
}

export function EventTag(props: { tag: CalendarTag }) {
    if (props.tag === CalendarTag.inChurch) return <></>;
    return <Tooltip tip={{
        [CalendarTag.private]: "Vertraulich",
        [CalendarTag.announcement]: "Ankündigung",
        [CalendarTag.cancelled]: "Abgesagt",
        [CalendarTag.suggestion]: "Noch nicht veröffentlicht",
    }[props.tag]}>
        <div className="bg-black/[4%] p-1 rounded">
            {{
                [CalendarTag.private]: <>🔒</>,
                [CalendarTag.announcement]: <>⭐</>,
                [CalendarTag.cancelled]: <>❌</>,
                [CalendarTag.suggestion]: <>⚠️</>,
            }[props.tag]}
        </div>
    </Tooltip>
}

export function EventDescription(props: { event: Partial<CalendarEvent>, suggestion?: Collections['eventSuggestion'] }) {
    if (props.event.tags?.includes(CalendarTag.cancelled)) return <></>;
    const dateChanged = props.suggestion?.data.date.some(d => d[0] !== 0);
    const roles = ["reading1", "reading2", "communionMinister1", "communionMinister2"] as const

    return <div className="font-normal text-sm leading-4 flex flex-col lg:flex-row gap-3">
        <div className="grow">
            {props.event.mainPerson && `mit ${props.event.mainPerson}`}
            <div>
                <DiffView>{props.suggestion?.data.description ?? props.event.description ?? ""}</DiffView>
            </div>
            {dateChanged && props.suggestion?.type !== "add" && <div className="mt-4 border-t border-black/30">
                {dateChanged && <div>
                    Änderung des Termins: <DiffView>{props.suggestion?.data.date ?? ""}</DiffView>
                </div>}
            </div>}
        </div>
        {roles.some(role => props.event.readerInfo?.[role]) &&
        <div className="px-2 py-1 bg-black/[4%] rounded grow mx-4">
            {roles.filter(role => props.event.readerInfo?.[role]).map(role => <div>{roleToString(role)}: {props.event.readerInfo?.[role]?.name}</div>)}
        </div>
        }
    </div>;
}

export const EventDate = ({date}: { date: Date }) => {
    const day = date.getDay();
    return <div className={`flex gap-3 items-end`}>
        <div className="text-2xl lg:hidden">{getWeekDayName(day)},</div>
        <div className={`text-2xl lg:text-3xl ${day ? '' : 'lg:font-bold'}`}>{date.getDate()}.</div>
        <div className="leading-4 text-sm flex gap-5  lg:gap-0 lg:flex-col">
            <div className="text-2xl lg:text-sm">{getMonthName(date.getMonth())}</div>
            <div className="italic hidden lg:block">{getWeekDayName(day)}</div>
        </div>
    </div>;
}

export const EventDateText = ({date}: { date: Date }) => {
    const day = date.getDay();
    return <>
        {getWeekDayName(day)},{' '}
        {date.getDate()}. {getMonthName(date.getMonth())}
    </>;
}
export const EventTime = (props: {
    date: Date
}) => {
    const hour = props.date.getHours();
    const minutes = props.date.getMinutes();
    return <>{('0' + hour).slice(-2)}:{('0' + minutes).slice(-2)}</>;
}