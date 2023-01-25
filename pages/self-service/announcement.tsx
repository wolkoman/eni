import React, {useState} from 'react';
import Site from '../../components/Site';
import {Field, SelfServiceFileUpload, SelfServiceInput, SelfServiceParish} from "../../components/SelfService";
import {cockpit} from "../../util/cockpit-sdk";
import Button from "../../components/Button";
import {notifyAdminFromClientSide} from "../../util/telegram";


export default function EventPage() {
    const emptyForm = { mail: "", description: "", files: [], parish: "", hidden: false};
    const form = useState(emptyForm);
    const {mail, parish} = form[0];
    const [state, setState] = useState<'form' | 'loading' | 'success' | 'error'>('form');

    async function submit() {
        setState("loading");
        cockpit.collectionSave('announcements', form[0])
            .then(() => form[1](emptyForm))
            .then(() => {
                setState("success");
                notifyAdminFromClientSide("NEW ANNOUNCEMENT\n" + JSON.stringify(form[0]) + "\nhttps://eni.wien/intern");
            })
            .catch(() => {
                setState("error");
                notifyAdminFromClientSide("ERROR ANNOUNCEMENT\n" + JSON.stringify(form[0]));
            });
    }

    return <Site title="Ankündigung erstellen" showTitle={false}>
        {state === 'success' ? <div className="flex flex-col gap-4 items-start">
            Ihre Ankündigung wurde erfolgreich gespeichert.
            <Button label="Nochmals" onClick={() => setState("form")}/>
        </div> : <div className="flex flex-col w-full max-w-lg mx-auto">
            <div className="text-2xl font-bold">
                Ankündigung erstellen
            </div>
            <div className="my-6">
                Diese Ankündigung wird nach erfolgreicher Sichtung in den Wochenmitteilungen der Pfarren erscheinen.
            </div>
            <Field label="Ihre E-Mail Adresse (wird nicht veröffentlicht)">
                <SelfServiceInput name="mail" form={form}/>
            </Field>
            <Field label="Pfarre">
                <SelfServiceParish name="parish" form={form}/>
            </Field>
            <Field label="Beschreibung / Weitere Informationen">
                <SelfServiceInput name="description" input="textarea" form={form}/>
            </Field>
            <Field label="Dateien">
                <SelfServiceFileUpload name="files" form={form}/>
            </Field>
            <div className={`my-8 flex flex justify-end font-bold ${state === "loading" ? 'animate-pulse' : ''}`}>
                <Button label="Absenden" big={true} onClick={submit} disabled={state === "loading" || !mail.includes("@") || parish === ""}/>
            </div>
            {state === "error" && <div className="text-red-700 font-bold my-8">
                Die Ankündigung konnte nicht hochgeladen werden.
            </div>}
        </div>}
    </Site>;
}