import {Collections} from 'cockpit-sdk';
import React, {ReactNode, useEffect, useState} from 'react';
import Site from '../../../components/Site';
import {cockpit} from "../../../util/cockpit-sdk";
import {fetchJson} from "../../../util/fetch-util";
import {useRouter} from "next/router";
import {useBeforeunload} from "react-beforeunload";
import {toast} from "react-toastify";
import {saveFile} from "../../../util/save-file";
import {useUserStore} from "../../../util/use-user-store";
import {Permission} from "../../../util/verify";
import Button from "../../../components/Button";
import Responsive from "../../../components/Responsive";
import {Hamburger} from "../../../components/Hamburger";


export default function Index(props: { article: Collections['paper_articles'], project: Collections['paper_projects'], versions: Collections['paper_texts'][] }) {

    const router = useRouter();

    function MoreOptions(cprops: { editable: any, onSave: () => Promise<void>, saved: "saving" | "saved" | "justnow" | "error", permission: any, value: any, disabled: boolean, onSaveStatusChange: (status: Collections['paper_articles']['status']) => any, onFinish: () => void }) {
        return <div className="flex space-x-2 text-black/80">
            {cprops.editable && <Button label="Speichern" secondary={true} onClick={cprops.onSave}
                                        disabled={cprops.saved === "saving" || cprops.saved === "saved"}/>}
            {cprops.permission ? <>
                <Button label="Versionen" secondary={true}
                        onClick={() => router.push(`/intern/editor/version?articleId=${props.article._id}`)}/>
                <select
                    className="px-3 py-1 border border-black/60 bg-black/5 rounded cursor-pointer"
                    value={cprops.value} disabled={cprops.disabled}
                    onChange={event => cprops.onSaveStatusChange(event.target?.value as any)}>
                    <option value="writing">In Arbeit</option>
                    <option value="written">Geschrieben</option>
                    <option value="corrected">Lektoriert</option>
                    <option value="finished">Fertiggestellt</option>
                </select></> : cprops.editable && <Button label="Abgeben" onClick={cprops.onFinish}/>}
        </div>;
    }

    const [jwt, user, userLoad] = useUserStore(store => [store.jwt, store.user, store.load]);
    const permission = user?.permissions[Permission.Editor] ?? false;
    const editable = permission || props.article.status === "writing";
    const {query: {articleId}} = useRouter();
    const [text, setText] = useState(props.versions[0]?.text ?? '');
    const [length, setLength] = useState(0);
    const [note, setNote] = useState<'unfinished' | 'perfect' | 'excess'>('unfinished');
    const [saved, setSaved] = useState<'saving' | 'saved' | 'justnow' | 'error'>('saved');
    const [status, setStatus] = useState<typeof props.article.status>(props.article.status);
    const [statusLoading, setStatusLoading] = useState(false);
    const [finishModalOpen, setFinishModalOpen] = useState(false);
    const [mobilMenuOpen, setMobilMenuOpen] = useState(false);
    const [warning, setWarning] = useState({open: false, active: false});

    useEffect(() => {
        setLength(text.length);
        setNote(text.length < +props.article.char_min
            ? 'unfinished'
            : (text.length > +props.article.char_max ? 'excess' : 'perfect')
        );
        setSaved(x => x === 'saved' ? 'justnow' : x);
        if (text.length > +props.article.char_max + 100 && !warning.active) {
            setWarning({open: true, active: true});
        } else if (text.length < +props.article.char_max + 100 && warning.active) {
            setWarning({open: false, active: false});
        }
    }, [text, props.article.char_max, props.article.char_min, warning.active]);
    useEffect(() => {
        userLoad();
        const interval = setInterval(() => save(), 10000);
        return () => clearInterval(interval);
    }, []);

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
        if (saved === 'saved') return Promise.resolve();
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
            saveFile(`${props.article.name} ${new Date().toLocaleDateString("de-AT")}.txt`, new Blob([text]));
            throw new Error();
        })
    }

    function saveStatus(newStatus: typeof props.article.status) {
        setStatusLoading(true);
        return fetchJson("/api/editor/saveStatus", {json: {status: newStatus, articleId}, jwt})
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

    return <Site navbar={false} footer={false} responsive={false}>
        {finishModalOpen && <Modal>
            <div className="text-lg">Wollen Sie den Text abgeben?</div>
            <div className="space-x-2">
                <Button label="Abbrechen" secondary={true} onClick={() => setFinishModalOpen(false)}></Button>
                <Button label="Abgeben" onClick={finish}></Button>
            </div>
        </Modal>}
        {warning.open && <Modal>
            <div className="text-lg font-bold">Achtung, Zeichenlimit!</div>
            <div className="text-lg mb-2">Sie haben das Zeichenlimit weit überschritten.
            </div>
            <div className="space-x-2">
                <Button label="Okay" onClick={() => setWarning(value => ({...value, open: false}))}></Button>
            </div>
        </Modal>}
        <div className="flex flex-col h-screen">
            <div className="p-4">
                <Responsive>
                    {length === 0 ? <div className="py-12 max-w-lg mx-auto">
                            <div className="font-bold text-5xl mb-4">Schreibmaske</div>
                            <div className="text-xl">Artikel: <span
                                className="bg-white px-2 py-1">{props.article.name}</span></div>
                            <div className="text-xl">Autor:in: <span
                                className="bg-white px-2 py-1">{props.article.author}</span></div>
                            <div className="text-xl">Zeichen: <span
                                className="bg-white px-2 py-1">{props.article.char_min}-{props.article.char_max} Zeichen</span>
                            </div>
                            <div className="text-xl">Redaktionsschluss: <span
                                className="bg-white px-2 py-1">{new Date(props.project.deadline).toLocaleDateString()}</span>
                            </div>
                        </div> :
                        <div className="flex justify-between">
                            <div>
                                <div className="flex flex-row text-black/80">
                                    <div
                                        className="text-2xl mr-2 -mb-2 font-bold line-clamp-1">{props.article.name}</div>
                                </div>
                                <div className="text-sm line-clamp-1">{props.article.author} (Redaktionsschluss: {new Date(props.project.deadline).toLocaleDateString()})</div>
                            </div>
                            <div className="flex flex-row space-x-3 items-center">
                                {editable && <div className="opacity-80 text-sm whitespace-nowrap">{{
                                    saved: "gespeichert",
                                    saving: "speichert..",
                                    justnow: "gerade eben gespeichert",
                                    error: <div className="bg-red-600 text-white font-bold text-sm px-2 rounded">
                                        Speichern fehlgeschlagen
                                    </div>,
                                }[saved]}</div>}
                                <div className="md:hidden">
                                    <Hamburger onClick={() => setMobilMenuOpen(value => !value)}/>
                                </div>
                                <div className="hidden md:flex">
                                    <MoreOptions
                                        editable={editable} onSave={saveAndDownload} saved={saved}
                                        permission={permission} value={status} disabled={statusLoading}
                                        onSaveStatusChange={saveStatus}
                                        onFinish={() => setFinishModalOpen(true)}
                                    />
                                </div>
                            </div>
                        </div>}
                </Responsive>
            </div>
            <div className="h-full "><Responsive className="h-full relative">
                {mobilMenuOpen &&
                    <div className="bg-gray-200 absolute top-0 left-0 w-full p-4 md:hidden flex justify-center z-10">
                        <MoreOptions editable={editable} onSave={saveAndDownload} saved={saved} permission={permission}
                                     value={status} disabled={statusLoading} onSaveStatusChange={saveStatus}
                                     onFinish={() => setFinishModalOpen(true)}/>
                    </div>}
                <textarea
                    readOnly={!editable}
                    className={`w-full h-full outline-none font-serif text-lg p-4 rounded ${{
                        unfinished: `border border-black/50`,
                        perfect: `border-2 border-green-700`,
                        excess: 'border-2 border-red-600',
                    }[note]}`}
                    onChange={e => setText(e.target!.value)} defaultValue={props.versions[0]?.text ?? ''}>
            </textarea></Responsive></div>
            <div className={`py-2 px-4 transition-all ${{
                unfinished: ``,
                perfect: `text-green-700 font-bold`,
                excess: 'bg-red-600 text-white font-bold',
            }[note]}`}><Responsive><div className="flex justify-between">
                <div className="">{length} von {props.article.char_min}-{props.article.char_max} Zeichen</div>
                <div className={`px-2 rounded`}>{{
                    unfinished: `${Math.round(200 * length / (+props.article.char_min + +props.article.char_max))}%`,
                    perfect: `100%`,
                    excess: `${length - +props.article.char_max} Zeichen Überschuss`,
                }[note]}</div></div>
            </Responsive></div>
        </div>
    </Site>
}

function Modal(props: { children: ReactNode, title?: string }) {
    return <div
        className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center backdrop-blur-sm bg-black/20 z-20">
        <div className="bg-white border-4 border-black/10 rounded-lg shadow-lg text-center p-8">
            {props.title && <div className="font-bold mb-2">{props.title}</div>}
            <div>{props.children}</div>
        </div>
    </div>
}

export async function getServerSideProps(context: any) {
    const article = (await cockpit.collectionGet('paper_articles', {filter: {_id: context.query.articleId}})).entries[0];
    const project = (await cockpit.collectionGet('paper_projects', {filter: {_id: article.project._id}})).entries[0];
    const versions = (await cockpit.collectionGet('paper_texts', {
        filter: {article: context.query.articleId},
        sort: {_created: -1}
    })).entries
        .map((entry, index) => index === 0 ? entry : {_id: entry._id, _created: entry._created});

    return article ? {props: {article, versions, project}} : {notFound: true}
}