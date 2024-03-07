import {FilterType} from './Calendar';
import {ReactNode} from "react";

import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {Permissions} from "@/domain/users/Permission";
import {site} from "@/app/(shared)/Instance";
import Button from "../Button";

function FilterButtons(props: { children: ReactNode }) {
    return <div className="flex flex-wrap gap-2">{props.children}</div>;
}

export function FilterSelector(props: { filter: FilterType, setFilter: (filter: FilterType) => void, userPermissions: Permissions }) {
    const calendarNames: CalendarName[] = [CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT];
    const calendarInfos = calendarNames.map(getCalendarInfo);

    return site(<FilterButtons>
            <Button
                label="Alle Pfarren"
                onClick={() => props.setFilter(null)}
            />
            {calendarInfos.map(filt => <Button
                    label={filt.shortName}
                    key={filt.id}
                    onClick={() => props.setFilter({filterType: 'PARISH', parish: filt.id})}
                />
            )}
        </FilterButtons>, <></>);
}
