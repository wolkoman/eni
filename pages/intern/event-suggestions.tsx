import React from 'react';
import Site from '../../components/Site';
import {usePermission} from '../../util/use-permission';
import {Permission} from '../../util/verify';
import {applySuggestion, useAuthenticatedCalendarStore} from "../../util/use-calendar-store";
import {Event, EventDateText} from "../../components/calendar/Event";
import {EniLoading} from "../../components/Loading";
import Button from "../../components/Button";
import {fetchJson} from "../../util/fetch-util";
import {Collections} from "cockpit-sdk";
import {CalendarName} from "../../util/calendar-info";
import {CalendarEvent} from "../../util/calendar-types";

export default function Intern() {
    usePermission([Permission.CalendarAdministration]);
    const {openSuggestions, originalItems, loading, answerSuggestion} = useAuthenticatedCalendarStore();

    function answer(suggestion: Collections["eventSuggestion"], accepted: boolean) {
        return fetchJson("/api/calendar/answer", {json: {
            accepted, suggestionId: suggestion._id
        }}, {pending: "Speichern..", error: "Konnte nicht gespeichert werden", success: "Speichern erfolgreich"})
            .then(data => {
                answerSuggestion(suggestion._id, accepted);
                return data;
            })
            .catch(() => {})
    }

    return <Site title="Terminvorschläge" showTitle={true}>
        {loading && <EniLoading/>}
        {openSuggestions.map(suggestion => {
            const original = suggestion.type === "add"
                ? {tags: [], calendar: suggestion.data.parish} as any as CalendarEvent
                : originalItems.find(event => event.id === suggestion.eventId);
            console.log({original})
            if (!original) return <>Vergangen</>;
            const updated =  applySuggestion(original, suggestion);
            return <div className="bg-black/[2%] rounded-lg my-2 p-4">
                <div className="flex justify-between">
                    <div className="font-bold">Vorschlag von {suggestion.byName}</div>
                    <div className="flex justify-end gap-2">
                        <Button label="Akzeptieren" onClick={() => answer(suggestion, true)}/>
                        <Button label="Bearbeiten" onClick={() => answer(suggestion, true).then(({link}) => window.open(link))}/>
                        <Button label="Ablehnen" onClick={() => answer(suggestion, false)}/>
                    </div>
                </div>
                <div className="grid lg:grid-cols-2">
                    {suggestion.type !== "add" && <div>
                        <EventDateText date={new Date(original.date)}/>
                        <Event event={original} preventEditing={true}/>
                    </div>}
                    <div>
                        <EventDateText date={new Date(updated.date)}/>
                        <Event event={updated} preventEditing={true}/>
                    </div>
                </div>
            </div>;
        })}
    </Site>
}

