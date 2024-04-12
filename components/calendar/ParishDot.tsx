import {Tooltip} from "./EventUtils";
import {CalendarInfo} from "@/domain/events/CalendarInfo";

export function ParishDot({info, small, ...props}: { info: CalendarInfo, small?: boolean, private?: boolean, custom?: string }) {
    return <Tooltip tip={info?.fullName}>
        <div className="flex flex-col grow text-center">
            <div className="flex grow relative">
                <img src={info?.dot} className="w-6 -mt-1 relative z-10"/>
                {!small && <div className={info.className + " -ml-6 pl-6 pr-2 grow text-sm -mt-1 flex items-center w-[85px] h-6 rounded font-bold"}>{props.custom ?? info.tagName}</div>}
            </div>
            {props.private && <div className={" text-xs -mt-0.5 z-[-1] uppercase tracking-wider font-semibold"} data-testid="private-tag">Vertraulich</div>}
        </div>
    </Tooltip>;
}
