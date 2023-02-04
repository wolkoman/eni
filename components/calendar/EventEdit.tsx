import {CalendarEvent} from "../../util/calendar-types";
import {CalendarName} from "../../util/calendar-info";
import {useAuthenticatedCalendarStore} from "../../util/use-calendar-store";
import {useAuthenticatedUserStore} from "../../util/use-user-store";
import {useState} from "react";
import {fetchJson} from "../../util/fetch-util";
import {Field, SelfServiceInput} from "../SelfService";
import Button from "../Button";
import {createDiffSuggestion, getSuggestion} from "../../util/suggestion-utils";


export function EventEdit({event, ...props}: { event?: CalendarEvent, onClose: () => any, parish: CalendarName }) {
    const {addSuggestion, originalItems} = useAuthenticatedCalendarStore();
    const {user} = useAuthenticatedUserStore();
    const form = useState(getSuggestion(event))
    const [loading, setLoading] = useState(false);

    function save() {
        setLoading(true);
        fetchJson("/api/calendar/suggest", {
            json: {
                eventId: event?.id,
                data: {...createDiffSuggestion(getSuggestion(originalItems.find(e => e.id === event?.id)), form[0])},
                type: event ? "edit" : "add",
                parish: props.parish
            }
        }, {
            error: "Änderung konnte nicht gespeichert werden",
            pending: "Speichere..",
            success: "Die Änderung wurde vorgeschlagen. Sie ist noch nicht öffentlich."
        }).then(suggestion => {
            props.onClose();
            addSuggestion(suggestion, user!._id);
        }).finally(() => setLoading(false))
    }

    return <div
        className={`absolute top-0 ${event ? 'left-0' : 'right-0'} bg-white rounded-lg shadow-lg p-4 z-40 w-96`}>
        <Field label="Name">
            <SelfServiceInput name="summary" form={form}/>
        </Field>
        <Field label="Datum">
            <SelfServiceInput name="date" form={form} type="date"/>
        </Field>
        <Field label="Uhrzeit">
            <SelfServiceInput name="time" form={form} type="time"/>
        </Field>
        <Field label="Beschreibung">
            <SelfServiceInput name="description" form={form} input="textarea"/>
        </Field>
        <div className={loading ? 'animate-pulse' : ''}>
            <Button label="Speichern" onClick={save} disabled={loading}></Button>
        </div>
    </div>;
}

export function EventEditBackground(props: { onClick: () => void }) {
    return <div className="fixed inset-0 bg-black/10 z-30" onClick={props.onClick}/>;
}