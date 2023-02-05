import {getMonthName, getWeekDayName} from "./Calendar";
import {CalendarEvent, CalendarTag} from "../../util/calendar-types";
import {SanitizeHTML} from "../SanitizeHtml";
import React, {ReactNode} from "react";
import {DiffView} from "./Event";
import {useAuthenticatedCalendarStore} from "../../util/use-calendar-store";

export function EventDescription(props: { event: CalendarEvent }) {
    return <div className="font-normal text-sm leading-4">
        <div>
            {!props.event.tags.includes(CalendarTag.singleEvent) &&
                <div className="text-xs p-0.5 m-1 bg-black/10 inline-block rounded">💫 Einzelevent</div>
            }
            {props.event.tags.includes(CalendarTag.private) &&
                <div className="text-xs p-0.5 m-1 bg-black/10 inline-block rounded">🔒 Vertraulich</div>
            }
            {props.event.tags.includes(CalendarTag.inChurch) && props.event.calendar === 'inzersdorf' &&
                <div className="text-xs p-0.5 m-1 bg-black/10 inline-block rounded">🎹 Orgel-Blocker</div>
            }
            {props.event.tags.includes(CalendarTag.suggestion) &&
                <div className="text-xs p-0.5 m-1 bg-black/10 inline-block rounded">⚠️ Noch nicht angenommen</div>
            }
        </div>
        {!props.event.tags.includes(CalendarTag.cancelled) && <>
            {props.event.mainPerson && `mit ${props.event.mainPerson}`}
            {props.event.description && <SanitizeHTML html={props.event.description?.replace(/\n/g, '<br/>')}/>}
            {props.event.readerInfo?.reading1 && <div className="px-2 py-1 bg-black/5 rounded mt-2">
                {props.event.readerInfo?.reading1 && <div>1. Lesung: {props.event.readerInfo?.reading1.name}</div>}
                {props.event.readerInfo?.reading2 && <div>2. Lesung: {props.event.readerInfo?.reading2.name}</div>}
            </div>}
        </>}
    </div>;
}

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
        [CalendarTag.singleEvent]: "Einzeltermin",
        [CalendarTag.private]: "Vertraulich",
        [CalendarTag.announcement]: "Ankündigung",
        [CalendarTag.cancelled]: "Abgesagt",
        [CalendarTag.suggestion]: "Noch nicht veröffentlicht",
    }[props.tag]}>
        <div className="bg-black/[4%] p-1 rounded">
            {{
                [CalendarTag.singleEvent]: <>☝🏼</>,
                [CalendarTag.private]: <>🔒</>,
                [CalendarTag.announcement]: <>⭐</>,
                [CalendarTag.cancelled]: <>❌</>,
                [CalendarTag.suggestion]: <>⚠️</>,
            }[props.tag]}
        </div>
    </Tooltip>
}

export function EventDescription3(props: { event: CalendarEvent }) {
    if (props.event.tags.includes(CalendarTag.cancelled)) return <></>;
    const {openSuggestions} = useAuthenticatedCalendarStore();
    const suggestion = openSuggestions.find(item => item.eventId === props.event.id);
    const dateChanged = suggestion?.data.date.some(d => d[0] !== 0);
    const timeChanged = suggestion?.data.time.some(d => d[0] !== 0);

    return <div className="font-normal text-sm leading-4 flex gap-3">
        <div className="grow">
            {props.event.mainPerson && `mit ${props.event.mainPerson}`}
            <div>
                <DiffView>{suggestion?.data.description ?? props.event.description}</DiffView>
            </div>
            {(dateChanged || timeChanged) && <div className="mt-4 border-t border-black/30">
                {dateChanged && <div>
                    Änderung des Termins: <DiffView>{suggestion?.data.date ?? ""}</DiffView>
                </div>}
                {timeChanged && <div>
                    Änderung der Uhrzeit:<DiffView>{suggestion?.data.time ?? ""}</DiffView>
                </div>}
            </div>}
        </div>
        {props.event.readerInfo?.reading1 &&
        <div className="px-2 py-1 bg-black/[4%] rounded grow mx-4">
            {props.event.readerInfo?.reading1 && <div>1. Lesung: {props.event.readerInfo?.reading1.name}</div>}
            {props.event.readerInfo?.reading2 && <div>2. Lesung: {props.event.readerInfo?.reading2.name}</div>}
        </div>
        }
    </div>;
}

export const EventDate = ({
    date
}: {
    date: Date
}) => {
    const day = date.getDay();
    return <div className="">
        <div className={`leading-5 text-lg bg-white py-2 ${day ? '' : 'underline'}`}>
            <EventDateText date={date}/>
        </div>
    </div>;
}

export const EventDate2 = ({
    date
}: {
    date: Date
}) => {
    const day = date.getDay();
    return <div className={`flex gap-3 items-end ${day ? '' : 'font-bold'}`}>
        <div className="text-2xl lg:text-3xl">{date.getDate()}.</div>
        <div className="leading-4 text-sm flex gap-5  lg:gap-0 lg:flex-col items-center">
            <div className="text-2xl lg:text-sm">{getMonthName(date.getMonth())}</div>
            <div className="italic">{getWeekDayName(day)}</div>
        </div>
    </div>;
}

export const EventDateText = ({
    date
}: {
    date: Date
}) => {
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