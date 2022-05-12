import {Collections} from 'cockpit-sdk';
import React, {ReactNode, useEffect, useState} from 'react';
import Site from '../../../../components/Site';
import {cockpit} from "../../../../util/cockpit-sdk";
import {fetchJson} from "../../../../util/fetch-util";
import {useRouter} from "next/router";
import {useBeforeunload} from "react-beforeunload";
import {toast} from "react-toastify";
import {saveFile} from "../../../../util/save-file";
import {useUserStore} from "../../../../util/use-user-store";
import {Permission} from "../../../../util/verify";
import Button from "../../../../components/Button";

export default function Index(props: { article: Collections['paper_articles'], versions: Collections['paper_texts'][] }) {

    const [jwt, user] = useUserStore(store => [store.jwt, store.user]);
    const permission = user?.permissions[Permission.Editor] ?? false;
    const editable = permission || props.article.status === "writing";
    const {query: {articleId}} = useRouter();
    const [text, setText] = useState(props.versions[0].text);
    const [length, setLength] = useState(0);
    const [note, setNote] = useState<'unfinished' | 'perfect' | 'excess'>('unfinished');
    const [saved, setSaved] = useState<'saving' | 'saved' | 'justnow' | 'error'>('saved');
    const [status, setStatus] = useState<typeof props.article.status>(props.article.status);
    const [statusLoading, setStatusLoading] = useState(false);
    const [finishModalOpen, setFinishModalOpen] = useState(false);
    useEffect(() => {
        setLength(text.length);
        setNote(text.length < +props.article.char_min ? 'unfinished' : (text.length > +props.article.char_max ? 'excess' : 'perfect'));
        setSaved(x => x === 'saved' ? 'justnow' : x);
    }, [text]);
    useEffect(() => {
        const interval = setInterval(() => save(), 10000);
        return () => clearInterval(interval);
    });

    useBeforeunload(async (event) => {
        if (saved !== 'saved' && editable) {
            event.preventDefault();
            await toast.promise(saveAndDownload(), {
                pending: "Speichert",
                error: "Konnte nicht gespeichert werden. Speichern Sie eine lokale Kopie!",
                success: "Gespeichert. Sie können das Fenster jetzt schließen."
            });
        }
    });

    function save(): Promise<void> {
        if (!editable) return Promise.reject();
        if (saved == 'saved') return Promise.resolve();
        setSaved('saving');
        return fetchJson("/api/editor/save", {json: {articleId, text}, jwt})
            .then(() => setSaved('saved'))
            .catch(() => {
                setSaved('error');
                throw new Error();
            })
    }

    function saveAndDownload() {
        return save().catch(() => {
            saveFile(`${props.article.name} ${new Date().toLocaleDateString()}.txt`, new Blob([text]));
            throw new Error();
        })
    }

    function saveStatus(newStatus: typeof props.article.status) {
        setStatusLoading(true);
        return fetchJson("/api/editor/saveStatus", {json: {status: newStatus}, jwt})
            .then(() => setStatus(newStatus))
            .catch(() => setStatus(status))
            .finally(() => setStatusLoading(false))
    }

    function finish() {
        return save()
            .then(() => saveStatus('written'))
            .then(() => window.location.reload())
            .catch(() => toast.error("Abgabe war nicht erfolgreich"));
    }

    return <div className="bg-black/[3%]"><Site navbar={false} footer={false}>
        {finishModalOpen && <Modal>
            <div className="text-lg">Wollen Sie den Text abgeben?</div>
            <div className="space-x-2">
                <Button label="Abbrechen" secondary={true} onClick={() => setFinishModalOpen(false)}></Button>
                <Button label="Abgeben" onClick={finish}></Button>
            </div>
        </Modal>}
        <div className="flex flex-col h-screen">
            <div className="flex justify-between py-3">
                <div>
                    <div className="flex items-center">
                        <div className="text-xl font-bold mr-2">{props.article.name}</div>
                        {editable && {
                            saved: <div className="opacity-80 text-sm">gespeichert</div>,
                            saving: <div className="opacity-80 text-sm">speichert..</div>,
                            justnow: <div className="opacity-80 text-sm">gerade eben gespeichert</div>,
                            error: <div className="bg-red-600 text-white font-bold text-sm px-2 rounded">Speichern
                                fehlgeschlagen</div>,
                        }[saved]}
                    </div>
                    <div className="text-sm">{props.article.author}</div>
                </div>
                <div className="flex space-x-3 items-start">
                    {editable && <div className="px-3 py-1 border border-black/10 rounded cursor-pointer"
                                      onClick={saveAndDownload}>Speichern
                    </div>}
                    {permission ? <select
                        className="px-3 py-1 border border-black/10 bg-black/5 rounded cursor-pointer"
                        value={status} disabled={statusLoading}
                        onChange={event => saveStatus(event.target?.value as any)}>
                        <option value="writing">In Arbeit</option>
                        <option value="written">Geschrieben</option>
                        <option value="corrected">Lektoriert</option>
                        <option value="finished">Fertiggestellt</option>
                    </select> : editable && <div
                        className="px-3 py-1 border border-black/10 bg-black/5 rounded cursor-pointer"
                        onClick={() => setFinishModalOpen(true)}>Abgeben</div>}
                </div>
            </div>
            <textarea
                readOnly={!editable}
                className={`${editable ? 'border' : 'bg-transparent'} border-black/10 w-full h-full outline-none p-5 font-serif text-lg rounded`}
                onChange={e => setText(e.target!.value)} defaultValue={props.versions[0].text}>

        </textarea>
            <div className="flex justify-between py-3">
                <div className="text-sms">{length} von {props.article.char_min}-{props.article.char_max} Zeichen</div>
                <div className={`text-sms px-2 rounded ${{
                    unfinished: `${Math.round(100 * length / ((+props.article.char_min + +props.article.char_max) * 0.5))}%`,
                    perfect: `bg-green-700 text-white`,
                    excess: 'bg-red-600 text-white font-bold',
                }[note]}`}>{{
                    unfinished: `${Math.round(200 * length / (+props.article.char_min + +props.article.char_max))}%`,
                    perfect: `100%`,
                    excess: `${length - +props.article.char_max} Zeichen Überschuss`,
                }[note]}</div>
            </div>
        </div>
    </Site></div>
}

function Modal(props: {children: ReactNode, title?: string}){
    return <div className="absolute top-0 left-0 w-screen h-screen bg-black/10 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-white border border-black/5 rounded-lg shadow text-center p-6">
            {props.title && <div className="font-bold mb-2">{props.title}</div>}
            <div>{props.children}</div>
        </div>
    </div>
}

export async function getServerSideProps(context: any) {
    const article = (await cockpit.collectionGet('paper_articles', {filter: {_id: context.params.articleId}})).entries[0];
    return article ? {
        props: {
            article,
            versions: (await cockpit.collectionGet('paper_texts', {filter: {article: context.params.articleId}})).entries
        }
    } : {
        notFound: true
    }
}