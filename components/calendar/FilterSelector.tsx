import {Permission, Permissions} from '../../util/verify';
import {CalendarName, getCalendarInfo} from '../../util/calendar-info';
import {FilterType} from './Calendar';
import {ReactNode} from "react";
import {CalendarGroup} from "../../util/calendar-types";
import {getGroupSorting} from "../../util/calendar-group";

function FilterButton(props: { active?: boolean, onClick?: () => void, label: string, activeColor?: string }) {
    return <div
        className={`px-3 py-1 text-center cursor-pointer rounded-lg ${props.active ? ((props.activeColor ?? "bg-black/5") + " font-semibold") : ""}`}
        onClick={props.onClick}
    >
        {props.label}
    </div>;
}

function FilterButtons(props: { children: ReactNode }) {
    return <div className="flex flex-wrap">{props.children}</div>;
}

export function FilterSelector(props: { filter: FilterType, setFilter: (filter: FilterType) => void, userPermissions: Permissions }) {
    const calendarNames: CalendarName[] = [CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT];
    const calendarInfos = calendarNames.map(getCalendarInfo);

    return <FilterButtons>
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
        </FilterButtons>;
}