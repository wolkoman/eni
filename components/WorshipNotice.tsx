import {CalendarEvent} from "../util/calendar-types";
import React from "react";

export function WorshipNotice(props: { worshipEvents: CalendarEvent[] }) {
    const nextEvent = props.worshipEvents.filter(event => Math.abs(
            (new Date(event.start.dateTime).getTime() - new Date().getTime()) / (1000 * 60 * 60)
        ) < 1
    )?.[0];
    return nextEvent ? <a href="/w">
        <div className={"bg-black"}>
            <div className="bg-emmaus/80 text-white text-center p-4 font-bold">
                Hier geht's zu den Liedern vom <u>Worship</u>!
            </div>
        </div>
    </a> : <></>;
}