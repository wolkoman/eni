import {Tooltip} from "./EventUtils";
import React from "react";
import {CalendarInfo, CalendarName, getCalendarInfo} from "../../app/termine/CalendarInfo";

export function ParishDot({info, small, ...props}: { info: CalendarInfo, small?: boolean, private: boolean }) {
    return <Tooltip tip={info?.fullName}>
        <div className="flex flex-col grow text-center">
            <div className="flex grow">
                <img src={info?.dot} className="w-6 -mt-1 relative"/>
                {!small && <div
                    className={info.className + " pt-0.5 grow text-sm -ml-3 -mt-1 pl-3 h-6 rounded-r-full font-bold"}>{info.tagName}</div>}
            </div>
            {props.private && <div className={info.borderColor + " text-xs border-2 pt-1.5 -mt-2 z-[-1] rounded-b-lg"}>Vertraulich</div>}
        </div>
    </Tooltip>;
}
