import {Permission, Permissions} from '../../util/verify';
import {CalendarName, getCalendarInfo} from '../../util/calendar-info';
import {FilterType} from './Calendar';
import {ReactNode} from "react";
import {CalendarGroup} from "../../util/calendar-types";
import {getGroupSorting} from "../../util/calendar-group";

function FilterButton(props: { active?: boolean, onClick?: () => void, label: string, activeColor?: string }) {
    return <div
        className={`px-4 py-1 mb-1 flex-grow text-center lg:text-left cursor-pointer rounded-xl ${props.active ? ((props.activeColor ?? "bg-black/5") + " font-bold") : ""}`}
        onClick={props.onClick}
    >
        {props.label}
    </div>;
}

function FilterButtons(props: { children: ReactNode }) {
    return <div className="flex md:flex-col overflow-x-auto">{props.children}</div>;
}

function FilterLabel(props: { children: ReactNode }) {
    return <div className="mt-3 mb-1 opacity-80 uppercase pl-3 text-sm hidden md:block">{props.children}</div>;
}

export function FilterSelector(props: { filter: FilterType, setFilter: (filter: FilterType) => void, userPermissions: Permissions, groups: CalendarGroup[], persons: string[] }) {
    const calendarNames: CalendarName[] = [CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT];
    const calendarInfos = calendarNames.map(getCalendarInfo);

    return <div className="flex flex-col">
        <div className="flex flex-col flex-row justify-around md:justify-start flex-shrink-0 whitespace-nowrap">
            <FilterButtons>
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
            </FilterButtons>
            {props.userPermissions[Permission.PrivateCalendarAccess] && false && <>
                <FilterLabel>Leitung</FilterLabel>
                <FilterButtons>
                    {props.persons.map((person, index) => <FilterButton
                            key={person + index}
                            active={props.filter?.filterType === "PERSON" && props.filter.person === person}
                            onClick={() => props.setFilter({filterType: 'PERSON', person})}
                            label={person}
                        />
                    )}
                </FilterButtons>
            </>}
            <FilterLabel>Termingruppe</FilterLabel>
            <FilterButtons>
                <div className="animate-pulse w-full flex lg:flex-col space-x-2 lg:space-x-0">
                    {props.groups.length === 0 && Array.from({length: 5}).map(() => <FilterButton label="​" active={true}/>)}
                </div>
                <div className={"hiddens flex  lg:flex-col"}>
                {props.groups
                    .sort((a, b) => getGroupSorting(b) - getGroupSorting(a))
                    .map(group => <FilterButton
                            label={group}
                            key={group}
                            onClick={() => props.setFilter({filterType: 'GROUP', group})}
                            active={props.filter?.filterType === "GROUP" && props.filter.group === group}
                        />
                    )}
                </div>
            </FilterButtons>
        </div>
    </div>
        ;
}