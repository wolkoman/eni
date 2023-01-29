import {useRouter} from 'next/router';
import {CalendarEvent, CalendarEventWithSuggestion, CalendarTag} from "../../util/calendar-types";
import {SanitizeHTML} from '../SanitizeHtml';
import {getMonthName, getWeekDayName} from './Calendar';
import {ParishTag} from './ParishTag';
import {CalendarName, getCalendarInfo} from "../../util/calendar-info";
import {useAuthenticatedUserStore} from "../../util/use-user-store";
import {Permission} from "../../util/verify";
import {useState} from "react";
import {Field, SelfServiceInput} from "../SelfService";
import Button from "../Button";
import {fetchJson} from "../../util/fetch-util";
import {useAuthenticatedCalendarStore} from "../../util/use-calendar-store";

export function EventEdit({event, ...props}: { event?: CalendarEvent, onClose: () => any, parish: CalendarName }) {
    const {addSuggestion} = useAuthenticatedCalendarStore();
    const {user} = useAuthenticatedUserStore();
    const form = useState({
        summary: event?.summary ?? "",
        description: event?.description ?? "",
        date: event?.date ?? "",
        time: event?.start.dateTime.substring(11, 16) ?? ""
    })

    function save() {
        fetchJson("/api/calendar/suggest", {
            json: {
                eventId: event?.id,
                data: {...form[0], parish: props.parish },
                type: event ? "edit" : "add"
            }
        }, {
            error: "Änderung konnte nicht gespeichert werden",
            pending: "Speichere..",
            success: "Die Änderung wurde vorgeschlagen. Sie ist noch nicht öffentlich."
        }).then(suggestion => {
            props.onClose();
            addSuggestion(suggestion, user!._id);
        })
    }

    return <div className={`absolute top-0 ${event ? 'left-0' : 'right-0'} bg-white rounded-lg shadow-lg p-4 z-40 w-96`}>
        <Field label="Name">
            <SelfServiceInput name="summary" form={form}/>
        </Field>
        <Field label="Datum">
            <SelfServiceInput name="date" form={form} type="date"/>
        </Field>
        <Field label="Uhrzeit">
            <SelfServiceInput name="time" form={form} type="time"/>
        </Field>
        <Field label="Beschreibung">
            <SelfServiceInput name="description" form={form} input="textarea"/>
        </Field>
        <div>
            <Button label="Speichern" onClick={save}></Button>
        </div>
    </div>;
}

export function EventEditBackground(props: { onClick: () => void }) {
    return <div className="fixed inset-0 bg-black/10 z-30" onClick={props.onClick}/>;
}

export function Event({event, ...props}: { event: CalendarEventWithSuggestion, noTag?: boolean, hideTagOnLarge?: boolean, preventEditing?: boolean }) {
    const {user} = useAuthenticatedUserStore();
    const editable = user?.permissions[Permission.PrivateCalendarAccess] && event.suggestion !== false && props.preventEditing !== true;
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
                    <EventSummary event={event}/>
                    {event.suggestion && <div className="px-1 inline-block">⚠️</div>
                    }
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


export function ParishTag2(props: { calendar: CalendarName, colorless?: boolean }) {
    const info = getCalendarInfo(props.calendar);
    return <div
        className={`w-24 leading-4 inline-block p-2 text-center rounded-r-lg cursor-default ${props.colorless || info.className}`}>{info.tagName}</div>
}

export function EventSummary(props: { event: CalendarEvent }) {
    const router = useRouter();
    const liturgy = false;
    return <span
        className={`${liturgy && 'underline hover:no-underline cursor-pointer'}`}
        onClick={liturgy ? () => router.push(`/termine/${props.event.id}`) : () => {
        }}
    >
    {props.event.summary}
  </span>;
}

export function EventDescription(props: { event: CalendarEvent }) {
    return <div className="font-normal text-sm leading-4">
        <div>
            {props.event.tags.includes(CalendarTag.private) &&
                <div className="text-xs p-0.5 m-1 bg-black/10 inline-block rounded">🔒 Vertraulich</div>}
            {props.event.tags.includes(CalendarTag.inChurch) && props.event.calendar === 'inzersdorf' &&
                <div className="text-xs p-0.5 m-1 bg-black/10 inline-block rounded">🎹 Orgel-Blocker</div>}
        </div>
        {!props.event.tags.includes(CalendarTag.cancelled) && <>
            {props.event.mainPerson && `mit ${props.event.mainPerson}`}
            {props.event.description && <SanitizeHTML html={props.event.description?.replace(/\n/g, '<br/>')}/>}
            {props.event.readerInfo?.reading1 && <div className="px-2 py-1 bg-black/5 rounded">
                {props.event.readerInfo?.reading1 && <div>1. Lesung: {props.event.readerInfo?.reading1.name}</div>}
                {props.event.readerInfo?.reading2 && <div>2. Lesung: {props.event.readerInfo?.reading2.name}</div>}
            </div>}
        </>}
    </div>;
}

export const EventDate = ({date}: { date: Date }) => {
    const day = date.getDay();
    return <div className="">
        <div className={`leading-5 text-lg bg-white py-2 ${day ? '' : 'underline'}`}>
            <EventDateText date={date}/>
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
export const EventTime = (props: { date: Date }) => {
    const hour = props.date.getHours();
    const minutes = props.date.getMinutes();
    return <>{('0' + hour).slice(-2)}:{('0' + minutes).slice(-2)}</>;
}