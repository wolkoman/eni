import {CalendarEvent, CalendarTag} from "../../util/calendar-types";
import {ParishTag, ParishTag3} from './ParishTag';
import {useAuthenticatedUserStore} from "../../util/use-user-store";
import {Permission} from "../../util/verify";
import React, {useState} from "react";
import {EventEdit, EventEditBackground} from "./EventEdit";
import {EventDescription, EventDescription3, EventTag, EventTime} from "./EventUtils";
import {getCalendarInfo} from "../../util/calendar-info";

export function Event({event, ...props}: { event: CalendarEvent, noTag?: boolean, hideTagOnLarge?: boolean, enableEditing?: boolean }) {
    const {user} = useAuthenticatedUserStore();
    const suggestion = event.tags.includes(CalendarTag.suggestion);
    const editable = user?.permissions[Permission.PrivateCalendarAccess] && suggestion && props.enableEditing;
    const [isEditing, setIsEditing] = useState(false);
    return <>
        <div
            className={`flex text-lg mb-1 ${event.tags.includes(CalendarTag.cancelled) && 'opacity-50'} group relative`}>
            <div className={`w-10 flex-shrink-0 mr-2 ${event.tags.includes(CalendarTag.cancelled) || 'font-semibold'}`}>
                {event.start.dateTime && <EventTime date={new Date(event.start.dateTime)}/>}
            </div>
            <div className={`mr-2 ${props.noTag && "hidden"} ${props.hideTagOnLarge && "lg:hidden"}`}>
                <ParishTag calendar={event.calendar} colorless={event.tags.includes(CalendarTag.cancelled)}/>
            </div>
            <div className="mb-2 leading-5" data-testid="event">
                <div className={`mt-1 ${event.tags.includes(CalendarTag.cancelled) || 'font-semibold'}`}>
                    {event.summary}
                    {editable && <div className="hidden group-hover:inline-block px-3 cursor-pointer"
                                      onClick={() => setIsEditing(true)}>🖊️</div>
                    }
                </div>
                <EventDescription event={event}/>
            </div>
            {isEditing && <EventEdit event={event} onClose={() => setIsEditing(false)} parish={event.calendar}/>}
        </div>
        {isEditing && <EventEditBackground onClick={() => setIsEditing(false)}/>}
    </>;
}

export function Event2({event, ...props}: { event: CalendarEvent, hideTagOnLarge?: boolean, enableEditing?: boolean }) {
    const {user} = useAuthenticatedUserStore();
    const cancelled = event.tags.includes(CalendarTag.cancelled);
    const announcement = event.tags.includes(CalendarTag.announcement);
    const editable = user?.permissions[Permission.PrivateCalendarAccess] && props.enableEditing;
    const info = getCalendarInfo(event.calendar);
    const [isEditing, setIsEditing] = useState(false);
    return <>
        <div
            className={`py-1 flex text-lg ${cancelled && 'opacity-50'} ${editable && 'cursor-pointer'} relative ${announcement && `${info.className} rounded-lg`}`}
            onClick={() => editable ? setIsEditing(true) : {}}
        >
            <div className="w-[30px] lg:w-[50px] pt-1.5 shrink-0">
                <ParishTag3 info={info}/>
            </div>
            <div className={`w-[50px] lg:w-[60px] flex-shrink-0 mr-2 ${cancelled || 'font-semibold'}`}>
                {event.start.dateTime && <EventTime date={new Date(event.start.dateTime)}/>}
            </div>
            <div className="grow">
                <div className={`${cancelled || 'font-semibold'}`}>{event.summary}</div>
                <EventDescription3 event={event}/>
            </div>
            <div className="flex gap-1" data-testid="event">
                {event.tags.map(tag => <EventTag key={tag} tag={tag}/>)}
            </div>
            {isEditing && <EventEdit event={event} onClose={() => setIsEditing(false)} parish={event.calendar}/>}
        </div>
        {isEditing && <EventEditBackground onClick={() => setIsEditing(false)}/>}
    </>;
}



