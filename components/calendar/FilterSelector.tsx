import {FilterType} from './Calendar';
import {ReactNode} from "react";

import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {Permissions} from "@/domain/users/Permission";
import {site} from "@/app/(shared)/Instance";

function FilterButton(props: { active?: boolean, onClick?: () => void, label: string, activeColor?: string }) {
    return <div
        className={`px-3 py-1 text-center cursor-pointer rounded-lg bg-black/5 ${props.active ? ((props.activeColor ?? "bg-black/10") + " font-semibold") : ""}`}
        onClick={props.onClick}
    >
        {props.label}
    </div>;
}

function FilterButtons(props: { children: ReactNode }) {
    return <div className="flex flex-wrap gap-2">{props.children}</div>;
}

export function FilterSelector(props: { filter: FilterType, setFilter: (filter: FilterType) => void, userPermissions: Permissions }) {
    const calendarNames: CalendarName[] = [CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT];
    const calendarInfos = calendarNames.map(getCalendarInfo);

    return site(<FilterButtons>
            <FilterButton
                label="Alle Pfarren"
                onClick={() => props.setFilter(null)}
                active={props.filter === null}
            />
            {calendarInfos.map(filt => <FilterButton
                    label={filt.shortName}
                    key={filt.id}
                    onClick={() => props.setFilter({filterType: 'PARISH', parish: filt.id})}
                    active={props.filter?.filterType === "PARISH" && props.filter.parish === filt.id}
                    activeColor={filt.className}
                />
            )}
        </FilterButtons>, <></>);
}
