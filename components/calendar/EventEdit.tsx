import {CalendarName} from "../../util/calendar-info";
import {useAuthenticatedCalendarStore} from "../../util/use-calendar-store";
import {useAuthenticatedUserStore} from "../../util/use-user-store";
import {useState} from "react";
import {fetchJson} from "../../util/fetch-util";
import {Field, SelfServiceInput, SelfServiceParish} from "../SelfService";
import Button from "../Button";
import {createDiffSuggestion, EventSuggestion, getSuggestionFromEvent} from "../../util/suggestion-utils";


export function EventEdit(props: { suggestion: EventSuggestion, eventId?: string, onClose: () => any, parish?: CalendarName }) {
    const {addSuggestion, originalItems} = useAuthenticatedCalendarStore();
    const originalItem = originalItems.find(e => e.id === props.eventId);
    const {user} = useAuthenticatedUserStore();
    const form = useState<EventSuggestion & {parish?: string | null}>({
        ...props.suggestion,
        parish: props.parish
    })
    const [loading, setLoading] = useState(false);

    function save() {
        setLoading(true);
        fetchJson("/api/calendar/suggest", {
            json: {
                eventId: props.eventId ?? null,
                data: createDiffSuggestion(originalItem
                    ? getSuggestionFromEvent(originalItem)
                    : {summary: "", description: "", time: "", date: ""}
                    , form[0]),
                parish: form[0].parish
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
        className={`absolute top-0 ${props.eventId ? 'left-0' : 'right-0'} bg-white rounded-lg shadow-lg p-4 z-40 w-96`}>
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
        <div className={props.parish !== "all" ? 'hidden' : ''}><Field label="Pfarre">
            <SelfServiceParish name="parish" form={form}/>
        </Field></div>
        <div className={loading ? 'animate-pulse' : ''}>
            <Button label="Speichern" onClick={save} disabled={loading}></Button>
        </div>
    </div>;
}

export function EventEditBackground(props: { onClick: () => void }) {
    return <div className="fixed inset-0 bg-black/10 z-30" onClick={props.onClick}/>;
}