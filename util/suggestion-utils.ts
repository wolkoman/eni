import {Collections} from "cockpit-sdk";
import {Diff, diff_match_patch} from 'diff-match-patch';
import {CalendarEvent} from "../app/termine/EventMapper";

export interface EventSuggestion{
    summary: string;
    description: string;
    date: string,
    time: string;
}

export function getSuggestionFromEvent(event: CalendarEvent): EventSuggestion {
    return {
        summary: event?.summary,
        description: event?.description,
        date: event?.date,
        time: event?.start ? new Date(event?.start.dateTime).toLocaleTimeString("de-AT", {timeZone: 'Europe/Vienna'}).substring(0,5) : ""
    };
}

export function getSuggestionFromDiff(suggestion: Collections["eventSuggestion"]): EventSuggestion{
    return {
        summary: suggestion?.data.summary.filter(([i]) => i >= 0).map(([_, str]) => str).join(""),
        description: suggestion?.data.description.filter(([i]) => i >= 0).map(([_, str]) => str).join(""),
        date: suggestion?.data.date.filter(([i]) => i >= 0).map(([_, str]) => str).join(""),
        time: suggestion?.data.time.filter(([i]) => i >= 0).map(([_, str]) => str).join("")
    };
}

export function createDiffSuggestion(a: EventSuggestion, b: EventSuggestion) {
    const dmp = new diff_match_patch();
    return Object.fromEntries(Object.entries(a).map(([key, aValue]) => {
        const diff = dmp.diff_main(aValue, b[key as keyof EventSuggestion]);
        dmp.diff_cleanupSemantic(diff);
        return [key, diff];
    }));
}


export function applySuggestionToPatch( suggestion: Collections['eventSuggestion'], event?: CalendarEvent) {
    const dmp = new diff_match_patch();
    const apply = (diffs: Diff[], text?: string) => dmp.patch_apply(dmp.patch_make(diffs), text ?? "");
    const data = {
        summary: apply(suggestion.data.summary, event?.summary),
        description: apply(suggestion.data.description, event?.description),
        time: apply(suggestion.data.time, event?.time ?? undefined),
        date: apply(suggestion.data.date, event?.date),
    }
    const applicable = Object.values(data).map(x => x[1]).flat().every(x => x);
    const data2 = Object.fromEntries(Object.entries(data)
            .map(([key, [newValue]]) => ({
                key: key as keyof EventSuggestion,
                newValue,
                suggestion: event
                    ? getSuggestionFromEvent(event)
                    : {summary: "", description: "", time: "", date: ""}
            }))
            .map(({key, suggestion, newValue}) => [key, dmp.diff_main(suggestion[key], newValue)])
        );
    return {suggestion: {...suggestion, data: data2} as Collections['eventSuggestion'], applicable};
}
