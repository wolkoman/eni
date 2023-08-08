import {CalendarGroup} from "@/domain/events/CalendarGroup";

export function getGroupSorting(group: CalendarGroup) {
    return [
        CalendarGroup.Kinder,
        CalendarGroup.Gemeinschaft,
        CalendarGroup.Gebet,
        CalendarGroup.Wallfahrt,
        CalendarGroup.Advent,
        CalendarGroup.Ostern,
        CalendarGroup.Ostern,
        CalendarGroup.Gottesdienst,
        CalendarGroup.Messe,
        CalendarGroup.Weihnachten,
    ].indexOf(group);
}
