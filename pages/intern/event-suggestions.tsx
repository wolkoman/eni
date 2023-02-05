import React from 'react';
import Site from '../../components/Site';
import {usePermission} from '../../util/use-permission';
import {Permission} from '../../util/verify';
import {useAuthenticatedCalendarStore} from "../../util/use-calendar-store";
import {DiffView, Event, Event2} from "../../components/calendar/Event";
import {EniLoading} from "../../components/Loading";
import Button from "../../components/Button";
import {fetchJson} from "../../util/fetch-util";
import {Collections} from "cockpit-sdk";
import {applySuggestion} from "../../util/suggestion-utils";
import {EventDateText} from "../../components/calendar/EventUtils";
import {diff_match_patch} from "diff-match-patch";

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
    const dmp = new diff_match_patch();
    return <Site title="Terminvorschläge" showTitle={true}>
        {loading && <EniLoading/>}
        {!loading && openSuggestions.length === 0 && <div>Keine Terminvorschläge</div>}
        {openSuggestions.map(suggestion => {
            const original = originalItems.find(event => event.id === suggestion.eventId);
            const updated = applySuggestion(suggestion, original);
            return <div className="bg-black/[2%] rounded-lg my-2 p-4">
                <div className="flex justify-between">
                    <div className="font-bold">Vorschlag von {suggestion.byName}</div>
                    <div className="flex justify-end gap-2">
                        <Button label="Akzeptieren" onClick={() => answer(suggestion, true)}/>
                        <Button label="Bearbeiten" onClick={() => answer(suggestion, true).then(({link}) => window.open(link))}/>
                        <Button label="Ablehnen" onClick={() => answer(suggestion, false)}/>
                    </div>
                </div>
                <div className="">
                    <DiffView>{suggestion.data.summary}</DiffView>
                    <DiffView>{suggestion.data.description}</DiffView>
                    <DiffView>{suggestion.data.date}</DiffView>
                    <DiffView>{suggestion.data.time}</DiffView>
                </div>
            </div>;
        })}
    </Site>
}

