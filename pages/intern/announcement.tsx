import React, {useState} from 'react';
import Site from '../../components/Site';
import {
    Field,
    SelfServiceFile,
    SelfServiceFileUpload,
    SelfServiceInput,
    SelfServiceParish
} from "../../components/SelfService";
import {cockpit} from "../../util/cockpit-sdk";
import Button from "../../components/Button";
import {notifyAdminFromClientSide} from "../../util/telegram";
import {useAuthenticatedUserStore} from "../../util/store/use-user-store";
import {usePermission} from "../../util/use-permission";


export default function EventPage() {
    usePermission([]);
    const {user} = useAuthenticatedUserStore();
    const emptyForm = { description: "", files: [] as SelfServiceFile[], parish: "", hidden: false};
    const form = useState(emptyForm);
    const {parish} = form[0];
    const [state, setState] = useState<'form' | 'loading' | 'success' | 'error'>('form');

    async function submit() {
        setState("loading");
        cockpit.collectionSave('announcements', {...form[0], files: form[0].files.map(f => f.result), by: user?._id, byName: user?.name})
            .then(() => form[1](emptyForm))
            .then(() => {
                setState("success");
                notifyAdminFromClientSide("NEW ANNOUNCEMENT \n" + JSON.stringify(form[0]) + "\n https://eni.wien/intern");
            })
            .catch(() => {
                setState("error");
                notifyAdminFromClientSide("ERROR ANNOUNCEMENT \n" + JSON.stringify(form[0]));
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
            <Field label="Beschreibung">
                <SelfServiceInput name="description" input="textarea" form={form}/>
            </Field>
            <Field label="Pfarre">
                <SelfServiceParish name="parish" form={form}/>
            </Field>
            <Field label="Dateien">
                <SelfServiceFileUpload name="files" form={form}/>
            </Field>
            <div className={`my-8 flex flex justify-end font-bold ${state === "loading" ? 'animate-pulse' : ''}`}>
                <Button label="Absenden" big={true} onClick={submit} disabled={state === "loading" || parish === "" || form[0].files.some(f => !f.finished)}/>
            </div>
            {state === "error" && <div className="text-red-700 font-bold my-8">
                Die Ankündigung konnte nicht hochgeladen werden.
            </div>}
        </div>}
    </Site>;
}