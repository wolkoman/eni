import {Event} from './calendar/Event';
import Responsive from "./Responsive";
import {SectionHeader} from "./SectionHeader";
import {EventDateText} from "./calendar/EventUtils";
import {EventsObject} from "@/domain/events/EventMapper";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {groupEventsByDate} from "@/domain/events/CalendarGrouper";

export function ChristmasDisplay(props: { eventsObject: EventsObject; }) {
    const events = props.eventsObject.events.filter(event => ["12-24", "12-25"].includes(event.date.slice(5)));

    if(events.length === 0) return <></>;

    return <div className="mb-20">
            <div className="flex justify-between">
                <SectionHeader id="termine">Heilig Abend und Weihnachten</SectionHeader>
            </div>
            <div className="grid md:grid-cols-3 gap-4 py-4">
                {[CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT]
                    .map(c => getCalendarInfo(c))
                    .map(calendar => <div className={` overflow-hidden rounded-2xl relative p-1 flex flex-col border ` + calendar.borderColor}>
                        <div className={calendar.className + " absolute inset-0 h-2"}/>
                        <div className="text-2xl font-bold text-center mt-6 mb-4">Pfarre {calendar.shortName}</div>
                        <div className="px-3">
                            {Object.entries(groupEventsByDate(events.filter(e => e.calendar === calendar.id)))
                                .map(([date, events]) => <div key={date}>
                                    <div className="my-2"><EventDateText date={new Date(date)} /></div>
                                    {(events ?? []).map(event => <Event key={event.id} event={event} small={true} />)}
                                </div>
                                )}
                        </div>
                    </div>
                    )}
            </div>
        </div>;

}
