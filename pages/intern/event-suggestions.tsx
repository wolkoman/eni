import React, {useState} from 'react';
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
import {useAuthenticatedSuggestionsStore} from "../../util/use-suggestions-store";

function ActiveSuggestion(props: { suggestion: Collections['eventSuggestion'], applicable?: boolean, active?: boolean, event: CalendarEvent | {} }) {
    const {answerSuggestion} = useAuthenticatedCalendarStore();
    const {add: addSuggestion} = useAuthenticatedSuggestionsStore();
    const [declineDialog, setDeclineDialog] = useState(false);
    const [declineMessage, setDeclineMessage] = useState<string | undefined>();

    function answer(suggestion: Collections["eventSuggestion"], accepted: true | string) {
        return fetchJson("/api/calendar/answer",
            {json: {accepted: accepted === true, suggestionId: suggestion._id, reason: accepted}},
            {pending: "Speichern..", error: "Konnte nicht gespeichert werden", success: "Speichern erfolgreich"}
        )
            .then(data => {
                answerSuggestion(suggestion._id, accepted === true);
                addSuggestion({...suggestion, accepted: accepted === true})
                return data;
            })
            .catch(() => {
            })
    }

    return <div className={ "grid lg:grid-cols-2 gap-2 "+(props.active ? `p-4 ${unibox}` : '')}>

        <div className="flex flex-col lg:flex-row gap-4 items-start">
            <EventDate
                date={new Date(props.suggestion.data.date.filter(([i]) => i >= 0).map(([_, str]) => str).join(""))}/>
            <Event event={props.event} suggestion={props.suggestion}/>
        </div>
        <div className="flex flex-col items-end">
            <div className="">
                {props.suggestion.byName} ({new Date(props.suggestion._modified*1000).toLocaleString("de-AT")})
            </div>

            {props.active && <div className="flex  gap-2 relative">
                {props.applicable && <>
                    <Button label="Akzeptieren" onClick={() => answer(props.suggestion, true)}/>
                    <Button label="Bearbeiten"
                            onClick={() => answer(props.suggestion, true).then(({link}) => window.open(link))}/>
                </>}
                <Button label="Ablehnen" onClick={() => setDeclineDialog(true)}/>
                {declineDialog && <div className="absolute top-0 left-0 z-40 bg-white p-4 shadow-lg rounded-lg flex flex-col gap-2">
                    <div className="flex gap-2">
                        <Button secondary={true} label="Terminkollision" onClick={() => setDeclineMessage("Es gibt eine Terminkollision zu diesem Zeitpunkt.")}/>
                        <Button secondary={true} label="Ausführlich" onClick={() => setDeclineMessage("Dieser Vorschlag ist zu umfangreich. Der Terminkalender dient lediglich zur Anzeige von prägnanten Informationen. Ausführliche Einladungen, Beschreibungen, o.ä. würden wir Sie bitten über die Wochenmitteilungen zu verlautbaren.")}/>
                        <Button secondary={true} label="Duplikat" onClick={() => setDeclineMessage("Eine ähnliche Änderung wurde bereits eingebracht. Bitte überprüfen Sie ob die Termine in der jetzigen Form korrekt sind, und bringen sie allenfalls Änderungen nochmals ein.")}/>
                    </div>
                    <textarea
                        className="h-24 p-2 border border-black/20 rounded-lg"
                        value={declineMessage}
                        onChange={({target}) => setDeclineMessage(target.value)}
                    />
                    <div className="flex gap-2 flex-row-reverse">
                        <Button label="Mail senden" disabled={!declineMessage} onClick={() => answer(props.suggestion, declineMessage!)}/>
                    </div>
                </div>}
            </div>}
            {declineDialog && <div className="fixed inset-0 z-30 bg-black/40 p-4 shadow-lg rounded-lg" onClick={() => setDeclineDialog(false)}/>}
            {props.suggestion.closedBy && <div className="flex gap-2">
                {props.suggestion.accepted ? 'akzeptiert' : 'abgelehnt'} von{' '}
                {props.suggestion.closedByName} ({new Date(props.suggestion._modified*1000).toLocaleString("de-AT")})
            </div>}
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

