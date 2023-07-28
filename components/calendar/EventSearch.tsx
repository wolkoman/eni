import {FilterType} from "./Calendar";
import React from "react";
import {getCalendarInfo} from "../../app/termine/CalendarInfo";

export function EventSearch(props: { onChange: (value: string) => any, filter: FilterType }) {
    return <input className="border border-black/20 px-3 py-1 rounded font-bold max-w-lg"
                  onChange={({target}) => props.onChange(target.value)} placeholder={props.filter ? {
        PERSON: `Suche mit ${props.filter?.filterType === "PERSON" && props.filter.person}`,
        GROUP: `Suche nach ${props.filter?.filterType === "GROUP" && props.filter.group}`,
        PARISH: `Suche in ${props.filter?.filterType === "PARISH" && getCalendarInfo(props.filter.parish).shortName}`
    }[props.filter.filterType] : "Suche"}/>;
}
