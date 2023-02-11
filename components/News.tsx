import {CalendarGroup, CalendarTag, EventsObject} from "../util/calendar-types";
import {Liturgy} from "../pages/api/liturgy";
import {getCalendarInfo} from "../util/calendar-info";
import {EventDateText, EventTime} from "./calendar/EventUtils";

export function News(props: { eventsObject: EventsObject, liturgyEvents: (Liturgy & { date: string })[] }) {

    const now = new Date().getTime();
    const announcements = [
        ...props.eventsObject.events
            .filter(event => event.tags.includes(CalendarTag.announcement))
            .map(event => ({...event, liturgy: false})),
        ...props.liturgyEvents.map(event => ({...event, summary: event.displayName ?? event.name, liturgy: true}))
    ]
        .map(event => ({
            ...event,
            points: (event.liturgy ? 0 : 0) + Math.pow((new Date(event.date).getTime() - now) / 10000000, 2)
        }))
        .sort((a, b) => a.points - b.points);
    const announcement = announcements[0];

    return <>

        <div className="bg-[url(/bg-login.svg)] bg-center bg-cover flex flex-col items-center">
            <div className="h-0.5 lg:h-1 w-full bg-black"/>
            <div className="my-20 text-white">
                <div className="text-xl flex justify-center items-center flex-row flex-wrap gap-2 lg:gap-10 uppercase">
                    <div>{announcement.liturgy ? "Kirchliches Fest" : "Ankündigung"}</div>
                    <div className="flex gap-2 lg:gap-10">
                        <div><EventDateText date={new Date(announcement.date)}/></div>
                        {'start' in announcement && <EventTime date={new Date(announcement.start.dateTime)}/>}
                    </div>
                </div>
                <div className="text-4xl lg:text-7xl font-bold my-4 text-center">
                    {announcement.summary}
                </div>
                {'calendar' in announcement && <div
                    className={`text-xl font-bold px-4 py-1 rounded-full uppercase bg-white/30 text-center`}>
                    {getCalendarInfo(announcement.calendar).fullName}
                </div>}
                {announcement.liturgy && <div className={`flex flex-col gap-1 items-center`}>
                    {props.eventsObject.events
                        .filter(event =>
                            event.date === announcement.date &&
                            (event.groups.includes(CalendarGroup.Messe) || event.groups.includes(CalendarGroup.Gottesdienst))
                        )
                        .map(event => <div className="flex gap-3 items-center">
                            <div
                                className={`font-bold px-4 rounded-full uppercase bg-white/30`}>
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
            </div>
            <img src="/logo/dreipfarren.svg" className="lg:h-[250px] z-20"/>
            <div className="h-0.5 lg:h-1 -mt-0.5 lg:-mt-1 w-full bg-black"/>
        </div>


    </>;
}