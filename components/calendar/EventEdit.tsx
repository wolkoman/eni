import {CalendarEvent} from "../../util/calendar-types";
import {CalendarName} from "../../util/calendar-info";
import {useAuthenticatedCalendarStore} from "../../util/use-calendar-store";
import {useAuthenticatedUserStore} from "../../util/use-user-store";
import {useState} from "react";
import {fetchJson} from "../../util/fetch-util";
import {Field, SelfServiceInput} from "../SelfService";
import Button from "../Button";
import {getSuggestion} from "../../util/suggestion-utils";


export function EventEdit({event, ...props}: { event?: CalendarEvent, onClose: () => any, parish: CalendarName }) {
    const {addSuggestion} = useAuthenticatedCalendarStore();
    const {user} = useAuthenticatedUserStore();
    const form = useState(getSuggestion(event))

    function save() {
        fetchJson("/api/calendar/suggest", {
            json: {
                eventId: event?.id,
                data: {...form[0], parish: props.parish},
                type: event ? "edit" : "add"
            }
        }, {
            error: "Änderung konnte nicht gespeichert werden",
            pending: "Speichere..",
            success: "Die Änderung wurde vorgeschlagen. Sie ist noch nicht öffentlich."
        }).then(suggestion => {
            props.onClose();
            addSuggestion(suggestion, user!._id);
        })
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
        <div>
            <Button label="Speichern" onClick={save}></Button>
        </div>
    </div>;
}

export function EventEditBackground(props: { onClick: () => void }) {
    return <div className="fixed inset-0 bg-black/10 z-30" onClick={props.onClick}/>;
}