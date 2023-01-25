import {CalendarGroup, CalendarTag, EventsObject} from "../util/calendar-types";
import {Liturgy} from "../pages/api/liturgy";
import {EventDateText, EventTime} from "./calendar/Event";
import {getCalendarInfo} from "../util/calendar-info";

export function News(props: { eventsObject: EventsObject, liturgyEvents: (Liturgy & { date: string })[] }) {

    const now = new Date().getTime();
    const announcements = [
        ...props.eventsObject.events
            .filter(event => event.tags.includes(CalendarTag.announcement))
            .map(event => ({...event, liturgy: false})),
        ...props.liturgyEvents.map(event => ({...event, summary: event.name, liturgy: true}))
    ]
        .map(event => ({
            ...event,
            points: (event.liturgy ? 0 : 10000) + Math.pow((new Date(event.date).getTime() - now) / 10000000, 2)
        }))
        .sort((a, b) => a.points - b.points);
    const announcement = announcements[0];

    return <div className="flex flex-col items-center gap-2 my-8">
            <div className="text-lg flex flex-col justify-center items-center md:flex-row md:gap-8 uppercase">
                <div>{announcement.liturgy ? "Kirchliches Fest" : "Ankündigung"}</div>
                <div className="flex gap-8">
                    <div><EventDateText date={new Date(announcement.date)}/></div>
                    {'start' in announcement && <EventTime date={new Date(announcement.start.dateTime)}/>}
                </div>

            </div>
            <div className="text-4xl lg:text-5xl font-bold mb-4 text-center">
                {announcement.summary}
            </div>
            {'calendar' in announcement && <div
                className={`text-lg font-bold px-4 rounded-full ${getCalendarInfo(announcement.calendar).className}`}>
                {getCalendarInfo(announcement.calendar).fullName}
            </div>}
            {announcement.liturgy && <div className={`flex flex-col gap-1`}>
                {props.eventsObject.events
                    .filter(event =>
                        event.date === announcement.date &&
                        (event.groups.includes(CalendarGroup.Messe) || event.groups.includes(CalendarGroup.Gottesdienst)))
                    .map(event => <div className="flex gap-3 items-center">
                        <div
                            className={`font-bold px-4 rounded-full ${getCalendarInfo(event.calendar).className}`}>
                            {getCalendarInfo(event.calendar).tagName}
                        </div>
                        <div className="text-lg font-bold">
                            <EventTime date={new Date(event.start.dateTime)}/>
                        </div>
                        <div className="text-lg font-bold">
                            {event.summary}
                        </div>
                    </div>)
                }
            </div>}
        </div>;
}