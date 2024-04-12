import {getMonthName, getWeekDayName} from "./Calendar";
import React, {ReactNode} from "react";
import {DiffView} from "./Event";
import {Collections} from "cockpit-sdk";
import {CalendarEvent, CalendarTag} from "@/domain/events/EventMapper";
import {roleToString} from "@/domain/service/Service";
import {compareLiturgy} from "@/app/intern/reader/my/MyPage";
import {Liturgy} from "../../pages/api/liturgy";

export function Tooltip(props: { tip: string, children: ReactNode }) {
    return <div className="shrink-0">
        <div className="group relative">
            {props.children}
            <div
                className="opacity-0 group-hover:opacity-100 text-black pointer-events-none z-20 text-sm absolute left-0 -bottom-4 group-hover:-bottom-1 translate-y-full bg-white shadow-lg rounded px-3 py-1 whitespace-nowrap transition-all">
                {props.tip}
            </div>
        </div>
    </div>
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
            {roles.filter(role => props.event.readerInfo?.[role]).map(role => {
                const info = props.event.readerInfo?.[role];
                const cancelled = info?.status === "cancelled";
                return <div key={role}>{roleToString(role)}: <span className={cancelled ? 'line-through' : ''}>{info?.name}</span> {cancelled && ' (abgesagt)'}</div>;
              }
            )}
        </div>
        }
    </div>;
}

export const EventDate = (props: { date: Date, liturgies?: Liturgy[], showLiturgyInfo:boolean }) => {
    const day = props.date.getDay();
    const liturgy = props.liturgies?.sort(compareLiturgy)?.[0]
    const decoration = props.showLiturgyInfo ? ("underline decoration-2 " + {
        v: "decoration-[#f0f]",
        w: "decoration-[#ddd]",
        g: "decoration-[#0c0]",
        r: "decoration-[#f00]",
        "": ""
    }[liturgy?.color ?? ""]) : ""
    const weekDayName = getWeekDayName(day);
    return <>
        <div className={`font-semibold lg:hidden ${decoration}`}>{weekDayName}, {props.date.getDate()}. {getMonthName(props.date.getMonth())}</div>
        <div className={`hidden lg:flex flex-col`}>
            <div className={`font-semibold ${decoration}`}>{props.date.getDate()}. {getMonthName(props.date.getMonth())}</div>
            <div className={`text-xs`}>{liturgy?.name.toLowerCase().includes(weekDayName.toLowerCase()) ? "" : weekDayName}</div>
            <div className="mr-1 text-xs">{liturgy?.name}</div>
            <div className="mt-1 text-xs italic">{liturgy?.rank === "H" ? "Hochfest":""}</div>
    </div></>;
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
