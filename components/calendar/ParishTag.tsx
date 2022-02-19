import {Calendar} from '../../util/calendar-events';
import {getCalendarInfo} from '../../util/calendar-info';

export function ParishTag(props: { calendar: Calendar, colorless?: boolean }) {
    const info = getCalendarInfo(props.calendar);
    return <div
        className={`w-14 text-xs leading-4 inline-block px-1 py-0.5 text-center rounded cursor-default ${props.colorless || info.className}`}>{info.tagName}</div>
}