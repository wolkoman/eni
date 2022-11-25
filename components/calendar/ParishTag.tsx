import {CalendarName, getCalendarInfo} from '../../util/calendar-info';

export function ParishTag(props: { calendar: CalendarName, colorless?: boolean }) {
    const info = getCalendarInfo(props.calendar);
    return <div
        className={`w-18 text-xs leading-4 inline-block px-2 py-0.5 text-center rounded-full cursor-default ${props.colorless || info.className}`}>{info.tagName}</div>
}