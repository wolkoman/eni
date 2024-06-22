import {FilterType} from "./Calendar";
import {getCalendarInfo} from "@/domain/events/CalendarInfo";

export function EventSearch(props: { onChange: (value: string) => any, filter: FilterType }) {
    return <input className="border border-black/20 px-3 py-1 rounded font-bold max-w-lg"
                  onChange={({target}) => props.onChange(target.value)} placeholder={props.filter ? {
        GROUP: `Suche nach ${props.filter?.filterType === "GROUP" && props.filter.group}`,
    }[props.filter.filterType] : "Suche"}/>;
}
