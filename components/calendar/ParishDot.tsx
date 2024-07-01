import {Tooltip} from "./EventUtils";
import {CALENDAR_INFO} from "@/domain/events/CalendarInfo";

export function ParishDot({small, ...props}: { small?: boolean, private?: boolean }) {
    return <Tooltip tip={CALENDAR_INFO.fullName}>
        <div className="flex flex-col grow text-center">
            <div className="flex grow relative">
                <img src={CALENDAR_INFO.dot} className="w-6 -mt-1 relative z-10"/>
                {!small && <div className={CALENDAR_INFO.className + " -ml-6 pl-6 pr-2 grow text-sm -mt-1 flex items-center w-[85px] h-6 rounded font-bold"}>{CALENDAR_INFO.tagName}</div>}
            </div>
            {props.private && <div className={" text-xs -mt-0.5 z-[-1] uppercase tracking-wider font-semibold"} data-testid="private-tag">Vertraulich</div>}
        </div>
    </Tooltip>;
}
