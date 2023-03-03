import {CalendarGroup, CalendarTag, EventsObject} from "../util/calendar-types";
import {Liturgy} from "../pages/api/liturgy";
import {getCalendarInfo} from "../util/calendar-info";
import {EventDateText, EventTime} from "./calendar/EventUtils";

export function News() {

    return <>

        <div className="bg-black/5 bg-center bg-cover flex flex-col items-center">
            <div className="my-20">
                <div className="text-4xl lg:text-7xl font-bold my-4 text-center">
                    Miteinander dreier Pfarren
                </div>
            </div>
            <img src="/logo/dreipfarren.svg" className="lg:h-[200px] z-20"/>
        </div>


    </>;
}