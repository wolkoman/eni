import {Permission, Permissions} from '../../util/verify';
import {CalendarGroup} from '../../util/calendar-events';
import {CalendarName, getCalendarInfo} from '../../util/calendar-info';
import {FilterType} from './Calendar';
import {ReactNode} from "react";

function FilterButton(props: { active: boolean, onClick: () => void, label: string, activeColor?: string }) {
    return <div
        className={`px-3 py-1 mb-1 cursor-pointer rounded ${props.active ? (props.activeColor ?? "bg-gray-200") : ""}`}
        onClick={props.onClick}
    >
        {props.label}
    </div>;
}

function FilterLabel(props: {children: ReactNode}) {
    return <div className="mt-3 opacity-80 uppercase pl-3 text-sm">{props.children}</div>;
}

export function FilterSelector(props: { filter: FilterType, setFilter: (filter: FilterType) => void, userPermissions: Permissions, groups: CalendarGroup[], persons: string[] }) {
    const calendarNames: CalendarName[] = [CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT];
    const calendarInfos = calendarNames.map(getCalendarInfo);

    return <div className="flex flex-col">
        <div className="flex md:flex-col flex-row justify-around md:justify-start flex-shrink-0">
            <FilterButton
                label="Alle Termine"
                onClick={() => props.setFilter(null)}
                active={props.filter === null}
            />
            <FilterLabel>Pfarre</FilterLabel>
            {calendarInfos.map(filt => <FilterButton
                label={filt.shortName}
                key={filt.id}
                onClick={() => props.setFilter({filterType: 'PARISH', parish: filt.id})}
                active={props.filter?.filterType === "PARISH" && props.filter.parish === filt.id}
                activeColor={filt.className}
            />
            )}
            <FilterLabel>Termingruppe</FilterLabel>
            {props.groups.map(group => <FilterButton
                    label={group}
                    key={group}
                    onClick={() => props.setFilter({filterType: 'GROUP', group})}
                    active={props.filter?.filterType === "GROUP" && props.filter.group === group}
                />
            )}
        </div>
        {props.userPermissions[Permission.PrivateCalendarAccess] && <div
            className="flex md:flex-col flex-row justify-around md:justify-start flex-shrink-0"
            data-testid="parish-selector">
            {props.persons.map((person, index) => <FilterButton
                    key={person + index}
                    active={props.filter?.filterType === "PERSON" && props.filter.person === person}
                    onClick={() => props.setFilter({filterType: 'PERSON', person})}
                    label={person}
                />

            )}
        </div>}
    </div>;
}