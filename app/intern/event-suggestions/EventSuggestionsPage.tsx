"use client"
import {toast} from "react-toastify";
import {useCalendarStore} from "@/store/CalendarStore";
import {Collections} from "cockpit-sdk";
import {CalendarEvent} from "../../(domain)/events/EventMapper";
import React, {useState} from "react";
import {EventDate} from "../../../components/calendar/EventUtils";
import {Event} from "../../../components/calendar/Event";
import Button from "../../../components/Button";
import Site from "../../../components/Site";
import {EniLoading} from "../../../components/Loading";
import {useSuggestionStore} from "../../(store)/SuggestionStore";
import {applySuggestionToPatch} from "../../(domain)/suggestions/SuggestionsMapper";
import {usePermission} from "../../(shared)/UsePermission";
import {Permission} from "../../(domain)/users/Permission";
import {fetchJson} from "../../(shared)/FetchJson";
import {answerEventSuggestions} from "./answer";

function ActiveSuggestion(props: {
  suggestion: Collections['eventSuggestion'],
  applicable?: boolean,
  active?: boolean,
  event: CalendarEvent | {}
}) {
  const removeSuggestion = useCalendarStore(state => state.removeSuggestion);
  const {add: addSuggestion} = useSuggestionStore(state => state);
  const [declineDialog, setDeclineDialog] = useState(false);
  const [declineMessage, setDeclineMessage] = useState<string | undefined>();

  function answer(suggestion: Collections["eventSuggestion"], accepted: true | string) {
    return toast.promise(answerEventSuggestions(suggestion._id, accepted === true, accepted === true ? "" : accepted),
      {pending: "Speichern..", error: "Konnte nicht gespeichert werden", success: "Speichern erfolgreich"}
    )
      .then(data => {
        removeSuggestion(suggestion._id);
        addSuggestion({...suggestion, accepted: accepted === true})
        return data;
      })
      .catch(() => {
        return ""
      })
  }

  return <div className="grid lg:grid-cols-2 gap-2 p-4">

    <div className="flex flex-col lg:flex-row gap-4 items-start">
      <EventDate
        date={new Date(props.suggestion.data.date.filter(([i]) => i >= 0).map(([_, str]) => str).join(""))}/>
      <Event event={props.event} suggestion={props.suggestion}/>
    </div>
    <div className="flex flex-col items-end">
      <div className="">
        {props.suggestion.byName} ({new Date(props.suggestion._modified * 1000).toLocaleString("de-AT")})
      </div>

      {props.active && <div className="flex  gap-2 relative">
        {props.applicable && <>
            <Button label="Akzeptieren" onClick={() => answer(props.suggestion, true)}/>
            <Button label="Bearbeiten"
                    onClick={() => answer(props.suggestion, true).then((link) => window.open(link))}/>
        </>}
          <Button label="Ablehnen" onClick={() => setDeclineDialog(true)}/>
        {declineDialog &&
            <div className="absolute top-0 left-0 z-40 bg-white p-4 shadow-lg rounded-lg flex flex-col gap-2">
                <div className="flex gap-2">
                    <Button secondary={true} label="Terminkollision"
                            onClick={() => setDeclineMessage("Es gibt eine Terminkollision zu diesem Zeitpunkt.")}/>
                    <Button secondary={true} label="Ausführlich"
                            onClick={() => setDeclineMessage("Dieser Vorschlag ist zu umfangreich. Der Terminkalender dient lediglich zur Anzeige von prägnanten Informationen. Ausführliche Einladungen, Beschreibungen, o.ä. würden wir Sie bitten über die Wochenmitteilungen zu verlautbaren.")}/>
                    <Button secondary={true} label="Duplikat"
                            onClick={() => setDeclineMessage("Eine ähnliche Änderung wurde bereits eingebracht. Bitte überprüfen Sie ob die Termine in der jetzigen Form korrekt sind, und bringen sie allenfalls Änderungen nochmals ein.")}/>
                </div>
                <textarea
                    className="h-24 p-2 border border-black/20 rounded-lg"
                    value={declineMessage}
                    onChange={({target}) => setDeclineMessage(target.value)}
                />
                <div className="flex gap-2 flex-row-reverse">
                    <Button label="Mail senden" disabled={!declineMessage}
                            onClick={() => answer(props.suggestion, declineMessage!)}/>
                </div>
            </div>}
      </div>}
      {declineDialog && <div className="fixed inset-0 z-30 bg-black/40 p-4 shadow-lg rounded-lg"
                             onClick={() => setDeclineDialog(false)}/>}
      {props.suggestion.closedBy && <div className="flex gap-2">
        {props.suggestion.accepted ? 'akzeptiert' : 'abgelehnt'} von{' '}
        {props.suggestion.closedByName} ({new Date(props.suggestion._modified * 1000).toLocaleString("de-AT")})
      </div>}
    </div>
  </div>;
}

export function EventSuggestionsPage() {
  usePermission([Permission.CalendarAdministration]);
  const [openSuggestions, items, loading] = useCalendarStore(state => [state.openSuggestions, state.items, state.loading]);
  const {items: suggestions, loading: loading2, load} = useSuggestionStore(state => state);
  const [pastSuggestions, setPastSuggestions] = useState(false)

  return <Site title="Terminvorschläge" showTitle={true}>
    {loading && <EniLoading/>}
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
    {pastSuggestions ? <>
      <div className="font-bold mt-6 mb-2">Vergangene Vorschläge</div>
      {loading2 && <EniLoading/>}
      <div className="flex flex-col gap-2">
        {suggestions.sort((a, b) => b._modified - a._modified).map(suggestion => <ActiveSuggestion
          key={suggestion._id}
          suggestion={suggestion}
          event={{}} active={false}
        />)}
      </div>
    </> : <div><Button label="Vergangene Vorschläge laden" onClick={() => {
      setPastSuggestions(true);
      load()
    }} secondary={true}/></div>
    }
  </Site>
}

