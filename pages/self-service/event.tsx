import React, {ReactNode} from 'react';
import Site from '../../components/Site';


function Field(props: { children: ReactNode, name: string, label: string }) {
    return <div className=" my-2">
        <div>{props.label}</div>
        {props.children}
    </div>;
}

function SelfServiceInput(props: { type?: string, input?: 'textarea' }) {
    const Tag = props.input ?? "input";
    return <Tag
        {...(Tag === "input" ? {type: props.type} : {})}
        className="bg-white rounded bg-black/5 border border-black/40 focus:border-black/80 text-lg font-bold px-5 py-2 outline-none"
    />;
}

export default function EventPage() {

    return <Site title="Termin anmelden">
        <Field name="summary" label="Name des Termins">
            <SelfServiceInput/>
        </Field>
        <div className="flex gap-4">
            <Field name="date" label="Datum">
                <SelfServiceInput type="date"/>
            </Field>
            <Field name="time" label="Uhrzeit">
                <SelfServiceInput type="time"/>
            </Field>
        </div>
        <Field name="description" label="Beschreibung / Weitere Informationen">
            <SelfServiceInput input="textarea"/>
        </Field>
    </Site>;
}