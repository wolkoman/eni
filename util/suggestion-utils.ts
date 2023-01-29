import {CalendarEvent, CalendarEventWithSuggestion} from "./calendar-types";
import {Collections} from "cockpit-sdk";
import {CalendarName} from "./calendar-info";

export function mergeEventsWithSuggestions(events: CalendarEvent[], suggestions: Collections["eventSuggestion"][], userId: string): CalendarEventWithSuggestion[] {
    return [
        ...suggestions
            .filter(suggestion => suggestion.type === "add")
            .map(suggestion => applySuggestion(suggestion, undefined, true)),
        ...events
            .map(event => ({event, suggestion: suggestions.find(suggestion => suggestion.eventId === event.id)}))
            .map(({event, suggestion}) => suggestion?.by === userId ? applySuggestion(suggestion, event, true) : {
                ...event,
                suggestion: suggestion ? undefined : undefined
            })]
}

export function applySuggestion(suggestion: Collections["eventSuggestion"], event?: Omit<CalendarEvent, "id">, markAsSuggestion?: boolean) {
    return {
        id: `suggestion_${suggestion._id}`,
        ...(event ?? {tags: []} as any as CalendarEvent),
        summary: suggestion.data.summary,
        description: suggestion.data.description,
        date: suggestion.data.date,
        start: {dateTime: `${suggestion.data.date}T${suggestion.data.time}:00`},
        suggestion: markAsSuggestion ? true : undefined,
        calendar: suggestion.data.parish as CalendarName
    }
}

export function getSuggestion(event?: CalendarEvent) {
    return {
        summary: event?.summary ?? "",
        description: event?.description ?? "",
        date: event?.date ?? "",
        time: event?.start.dateTime.substring(11, 16) ?? ""
    };
}