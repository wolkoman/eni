import {CalendarEvent, CalendarTag} from "./calendar-types";
import {Collections} from "cockpit-sdk";
import {CalendarName} from "./calendar-info";
import {diff_match_patch} from 'diff-match-patch';

export function mergeEventsWithSuggestions(events: CalendarEvent[], suggestions: Collections["eventSuggestion"][], userId: string): CalendarEvent[] {
    return [
        ...suggestions
            .filter(suggestion => suggestion.type === "add")
            .map(suggestion => applySuggestion(suggestion, undefined, true)),
        ...events
            .map(event => ({event, suggestion: suggestions.find(suggestion => suggestion.eventId === event.id)}))
            .map(({event, suggestion}) => suggestion?.by === userId ? applySuggestion(suggestion, event, true) : event)]
}

export function applySuggestion(suggestion: Collections["eventSuggestion"], event?: Omit<CalendarEvent, "id">, markAsSuggestion?: boolean): CalendarEvent {
    const dmp = new diff_match_patch();
    const date = dmp.patch_apply(suggestion.data.date, event?.date ?? "")[0];
    console.log({suggestion})
    return {
        id: `suggestion_${suggestion._id}`,
        ...(event ?? {tags: []} as any as CalendarEvent),
        summary: dmp.patch_apply(suggestion.data.summary, event?.summary ?? "")[0],
        description: dmp.patch_apply(suggestion.data.description, event?.description ?? "")[0],
        date: date,
        start: {dateTime: `${date}T${dmp.patch_apply(suggestion.data.summary, event?.start ? new Date(event?.start.dateTime).toLocaleTimeString("de-AT", {timeZone: "Europe/Vienna"}) : "")[0]}`},
        tags: [...(event?.tags ?? []), ...(markAsSuggestion ? [CalendarTag.suggestion] : [])],
        calendar: suggestion.parish as CalendarName
    }
}

interface EventSuggestion{
    summary: string;
    description: string;
    date: string,
    time: string;
}

export function getSuggestion(event?: CalendarEvent): EventSuggestion {
    return {
        summary: event?.summary ?? "",
        description: event?.description ?? "",
        date: event?.date ?? "",
        time: event?.start ? new Date(event?.start.dateTime).toLocaleTimeString("de-AT", {timeZone: 'Europe/Vienna'}).substring(0,5) : ""
    };
}

export function createDiffSuggestion(a: EventSuggestion, b: EventSuggestion) {
    const dmp = new diff_match_patch();
    return Object.fromEntries(Object.entries(a).map(([key, aValue]) => {
        const diff = dmp.diff_main(aValue, b[key as keyof EventSuggestion]);
        dmp.diff_cleanupSemantic(diff);
        const patch = dmp.patch_make(diff);
        return [key, patch];
    }));
}