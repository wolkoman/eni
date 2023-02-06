import React from 'react';
import Site from '../../components/Site';
import {usePermission} from '../../util/use-permission';
import {Permission} from '../../util/verify';
import {useAuthenticatedCalendarStore} from "../../util/use-calendar-store";
import {Event} from "../../components/calendar/Event";
import {EniLoading} from "../../components/Loading";
import Button from "../../components/Button";
import {fetchJson} from "../../util/fetch-util";
import {Collections} from "cockpit-sdk";
import {EventDate} from "../../components/calendar/EventUtils";
import {unibox} from "../../components/calendar/ComingUp";
import {applySuggestionToPatch} from "../../util/suggestion-utils";
import {CalendarEvent} from "../../util/calendar-types";
import {useAuthenticatedSuggestionsStore, useSuggestionsStore} from "../../util/use-suggestions-store";

function ActiveSuggestion(props: { suggestion: Collections['eventSuggestion'], applicable?: boolean, active?: boolean, event: CalendarEvent | {} }) {
    const {answerSuggestion} = useAuthenticatedCalendarStore();
    const {add: addSuggestion} = useAuthenticatedSuggestionsStore();

    function answer(suggestion: Collections["eventSuggestion"], accepted: boolean) {
        return fetchJson("/api/calendar/answer",
            {json: {accepted, suggestionId: suggestion._id}},
            {pending: "Speichern..", error: "Konnte nicht gespeichert werden", success: "Speichern erfolgreich"}
        )
            .then(data => {
                answerSuggestion(suggestion._id, accepted);
                addSuggestion({...suggestion, accepted})
                return data;
            })
            .catch(() => {
            })
    }

    return <div className={"p-4 " + unibox}>
        <div className="flex justify-between">
            <div className="font-bold">Vorschlag von {props.suggestion.byName}</div>
            {props.active && <div className="flex justify-end gap-2">
                {props.applicable && <>
                    <Button label="Akzeptieren" onClick={() => answer(props.suggestion, true)}/>
                    <Button label="Bearbeiten"
                            onClick={() => answer(props.suggestion, true).then(({link}) => window.open(link))}/>
                </>}
                <Button label="Ablehnen" onClick={() => answer(props.suggestion, false)}/>
            </div>}
            {props.suggestion.closedBy && <div className="flex justify-end gap-2">
                {props.suggestion.accepted ? 'akzeptiert' : 'abgelehnt'} von{' '}
                {props.suggestion.closedByName} ({new Date(props.suggestion._modified*1000).toLocaleString("de-AT")})
            </div>}
        </div>
        <div className="flex flex-col lg:flex-row gap-4 items-start">
            <EventDate
                date={new Date(props.suggestion.data.date.filter(([i]) => i >= 0).map(([_, str]) => str).join(""))}/>
            <Event event={props.event} suggestion={props.suggestion}/>
        </div>
    </div>;
}

export default function Intern() {
    usePermission([Permission.CalendarAdministration]);
    const {openSuggestions, items, loading} = useAuthenticatedCalendarStore();
    const {items: suggestions, loading: loading2} = useAuthenticatedSuggestionsStore();

    return <Site title="Terminvorschläge" showTitle={true}>
        {(loading || loading2) && <EniLoading/>}
        {!loading && openSuggestions.length === 0 && <div>Keine Terminvorschläge</div>}
        <div className="flex flex-col gap-2">
            {openSuggestions
                .map(suggestion => applySuggestionToPatch(suggestion, items.find(event => event.id === suggestion.eventId)))
                .map(({suggestion, applicable}) =>
                    <ActiveSuggestion
                        key={suggestion._id}
                        suggestion={suggestion}
                        applicable={applicable}
                        event={items.find(event => event.id === suggestion.eventId) ?? {}}
                        active={true}
                    />)}
        </div>
        <div className="font-bold mt-6 mb-2">Vergangene Vorschläge</div>
        <div className="flex flex-col gap-2">
            {suggestions.sort((a,b) => b._modified - a._modified).map(suggestion => <ActiveSuggestion
                key={suggestion._id}
                suggestion={suggestion}
                event={{}} active={false}
            />)}
        </div>
    </Site>
}

