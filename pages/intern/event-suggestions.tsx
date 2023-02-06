import React from 'react';
import Site from '../../components/Site';
import {usePermission} from '../../util/use-permission';
import {Permission} from '../../util/verify';
import {useAuthenticatedCalendarStore} from "../../util/use-calendar-store";
import {DiffView} from "../../components/calendar/Event";
import {EniLoading} from "../../components/Loading";
import Button from "../../components/Button";
import {fetchJson} from "../../util/fetch-util";
import {Collections} from "cockpit-sdk";
import {Event} from "../../components/calendar/Event";
import {EventDate2} from "../../components/calendar/EventUtils";

export default function Intern() {
    usePermission([Permission.CalendarAdministration]);
    const {openSuggestions, items, loading, answerSuggestion} = useAuthenticatedCalendarStore();

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
        {!loading && openSuggestions.length === 0 && <div>Keine Terminvorschläge</div>}
        {openSuggestions.map(suggestion => {
            return <div className={"bg-black/[2%] rounded-lg my-2 p-4 " + }>
                <div className="flex justify-between">
                    <div className="font-bold">Vorschlag von {suggestion.byName}</div>
                    <div className="flex justify-end gap-2">
                        <Button label="Akzeptieren" onClick={() => answer(suggestion, true)}/>
                        <Button label="Bearbeiten" onClick={() => answer(suggestion, true).then(({link}) => window.open(link))}/>
                        <Button label="Ablehnen" onClick={() => answer(suggestion, false)}/>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-4 items-start">
                        <EventDate2 date={new Date(suggestion.data.date.filter(([i]) => i >= 0).map(([_,str]) => str).join(""))}/>
                    <Event event={items.find(event => event.id === suggestion.eventId) ?? {}} suggestion={suggestion}/>
                </div>
            </div>;
        })}
    </Site>
}

