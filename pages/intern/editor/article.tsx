import {Collections} from 'cockpit-sdk';
import React, {ReactNode, useEffect, useState} from 'react';
import Site from '../../../components/Site';
import {fetchJson} from "../../../util/fetch-util";
import {useSearchParams} from "next/navigation";
import {useBeforeunload} from "react-beforeunload";
import {toast} from "react-toastify";
import {saveFile} from "../../../util/save-file";
import {Permission} from "../../../util/verify";
import Button from "../../../components/Button";
import Responsive from "../../../components/Responsive";
import {Hamburger} from "../../../components/Hamburger";
import {AnimatePresence, motion} from 'framer-motion';
import {SelfServiceFile, SelfServiceFileUpload} from "../../../components/SelfService";
import Link from "next/link";
import {Cockpit} from "../../../util/cockpit";
import {useUserStore} from "@/store/UserStore";


function Welcome(props: { article: any, project: any }) {
    return <div className="py-12 max-w-lg mx-auto">
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
    </div>;
}

export default function Index(props: { article: Collections['paper_articles'], project: Collections['paper_projects'], versions: Collections['paper_texts'][] }) {

    function MoreOptions(cprops: { editable: any, onSave: () => Promise<void>, saved: "saving" | "saved" | "justnow" | "error", permission: boolean, status: Collections['paper_articles']['status'], disabled: boolean, onSaveStatusChange: (status: Collections['paper_articles']['status']) => any, onFinish: () => void }) {
        return <div className="flex gap-2 text-black/80">
            {cprops.editable && <Button
                label={<img src="/logo/icon_save.svg" className="w-5 mt-0.5"/>}
                onClick={cprops.onSave}
                disabled={cprops.saved === "saving" || cprops.saved === "saved"}/>
            }
            {cprops.editable && <Button
                label={<img src="/logo/icon_media.svg" className="w-5 mt-0.5"/>}
                onClick={() => setMediaModalOpen(true)}/>
            }
            {cprops.permission ? <>
                <Link href={`/intern/editor/version?articleId=${props.article._id}`} target="_blank">
                    <Button label={<img src="/logo/icon_versions.svg" className="w-5 mt-0.5"/>}/>
                </Link>
                <select
                    className="px-3 py-1 bg-black/5 rounded-lg cursor-pointer"
                    value={cprops.status} disabled={cprops.disabled}
                    onChange={event => cprops.onSaveStatusChange(event.target?.value as any)}>
                    <option value="writing">In Arbeit</option>
                    <option value="written">Geschrieben</option>
                    <option value="corrected">Lektoriert</option>
                    <option value="finished">Fertiggestellt</option>
                </select></> : cprops.editable && <Button label="Abgeben" onClick={cprops.onFinish}/>}
        </div>;
    }


    const [article, setArticle] = useState(props.article);
    const user = useUserStore(state => state.user);
    const permission = user?.permissions?.[Permission.Editor] ?? false;
    const searchParams = useSearchParams();
    const [text, setText] = useState(props.versions[0]?.text ?? '');
    const [length, setLength] = useState(0);
    const [note, setNote] = useState<'unfinished' | 'perfect' | 'excess'>('unfinished');
    const [saved, setSaved] = useState<'saving' | 'saved' | 'justnow' | 'error'>('saved');
    const [status, setStatus] = useState<typeof article.status>(article.status);
    const [statusLoading, setStatusLoading] = useState(false);
    const [mediaModalOpen, setMediaModalOpen] = useState(false);
    const [finishModalOpen, setFinishModalOpen] = useState(false);
    const [mobilMenuOpen, setMobilMenuOpen] = useState(false);
    const [warning, setWarning] = useState({open: false, active: false});
    const editable = permission || status === "writing" || status === null;

    useEffect(() => {
        setLength(text.length);
        setNote(text.length < +article.char_min
            ? 'unfinished'
            : (text.length > +article.char_max ? 'excess' : 'perfect')
        );
        setSaved(x => x === 'saved' ? 'justnow' : x);
        if (text.length > +article.char_max + 100 && !warning.active) {
            setWarning({open: true, active: true});
        } else if (text.length < +article.char_max + 100 && warning.active) {
            setWarning({open: false, active: false});
        }
    }, [text, article.char_max, article.char_min, warning.active]);
    useEffect(() => {
        const interval = setInterval(() => save(), 10000);
        return () => clearInterval(interval);
    }, [saved]);

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
        return fetchJson("/api/editor/save", {json: {articleId: searchParams.get('articleId'), text}})
            .then(() => setSaved('saved'))
            .catch(() => {
                setSaved('error');
                throw new Error();
            })
    }

    function saveAndDownload() {
        return save().catch(() => {
            saveFile(`${article.name} ${new Date().toLocaleDateString("de-AT")}.txt`, new Blob([text]));
            throw new Error();
        })
    }

    function saveStatus(newStatus: typeof article.status) {
        setStatusLoading(true);
        return toast.promise(fetchJson("/api/editor/saveStatus", {
            json: {status: newStatus, articleId: searchParams.get('articleId')},
        }), {
            pending: "Status wird gespeichert",
            error: "Status konnte nicht gespeichert werden",
            success: "Status wurde gespeichert"
        }).then(() => setStatus(newStatus))
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
        <AnimatePresence>{mediaModalOpen && <MediaModal
            close={files => {
                setArticle(article => ({...article, files: files.map(value => ({value}))}));
                setMediaModalOpen(false);
            }}
            files={article.files?.map(({value}) => value) ?? []}
            articleId={article._id}
        />}</AnimatePresence>
        <AnimatePresence>{finishModalOpen && <Modal>
            <div className="text-lg">Wollen Sie den Text abgeben?</div>
            <div className="space-x-2">
                <Button label="Abbrechen" secondary={true} onClick={() => setFinishModalOpen(false)}></Button>
                <Button label="Abgeben" onClick={finish}></Button>
            </div>
        </Modal>}</AnimatePresence>
        <AnimatePresence>{warning.open && <Modal>
            <div className="text-lg font-bold">Achtung, Zeichenlimit!</div>
            <div className="text-lg mb-2">Sie haben das Zeichenlimit weit überschritten.
            </div>
            <div className="space-x-2">
                <Button label="Okay" onClick={() => setWarning(value => ({...value, open: false}))}></Button>
            </div>
        </Modal>}</AnimatePresence>
        <div className="flex flex-col h-screen">
            <div className="p-4">
                <Responsive>
                    {length === 0 ? <Welcome article={article} project={props.project}/> :
                        <div className="flex justify-between">
                            <div>
                                <div className="flex flex-row text-black/80">
                                    <div
                                        className="text-2xl mr-2 -mb-2 font-bold line-clamp-1">{article.name}</div>
                                </div>
                                <div
                                    className="text-sm line-clamp-1">{article.author} (Redaktionsschluss: {new Date(props.project.deadline).toLocaleDateString()})
                                </div>
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
                                        permission={permission} status={status} disabled={statusLoading}
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
                                     status={status} disabled={statusLoading} onSaveStatusChange={saveStatus}
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
            }[note]}`}><Responsive>
                <div className="flex justify-between">
                    <div className="">{length} von {article.char_min}-{article.char_max} Zeichen</div>
                    <div className={`px-2 rounded`}>{{
                        unfinished: `${Math.round(200 * length / (+article.char_min + +article.char_max))}%`,
                        perfect: `100%`,
                        excess: `${length - +article.char_max} Zeichen Überschuss`,
                    }[note]}</div>
                </div>
            </Responsive></div>
        </div>
    </Site>
}

function Modal(props: { children: ReactNode, title?: string }) {
    return <div
        className="absolute inset-0 w-screen h-screen flex items-center justify-center z-20">
        <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{opacity: 0}}
            exit={{opacity: 0}}
            animate={{opacity: 1}}
        />
        <motion.div
            className="relative bg-white rounded-lg shadow-lg text-center p-8"
            initial={{opacity: 0, scale: 0.2}}
            exit={{opacity: 0, scale: 0.2}}
            animate={{opacity: 1, scale: 1}}>
            {props.title && <div className="font-bold mb-2">{props.title}</div>}
            <div>{props.children}</div>
        </motion.div>
    </div>
}

function MediaModal(props: { close: (files: string[]) => void, files: string[], articleId: string }) {
    const mediaModalForm = useState({files: props.files.map((file, index) => ({
            result: file,
            finished: true,
            name: file.split("/").reverse()[0].substring(14),
            id: file,
            index
        })) as SelfServiceFile[]});
    const [saving, setSaving] = useState(false);
    const uploading = mediaModalForm[0].files.some(file => !file.finished);

    function closes() {
        setSaving(true);
        const files = mediaModalForm[0].files.map(({result}) => result);
        toast.promise(fetchJson("/api/editor/saveMedia?articleId=" + props.articleId, {json: files}), {
            pending: "Speichere Medien..",
            success: "Medien gespeichert",
            error: "Fehler beim Speichern"
        })
            .then(() => props.close(files));
    }

    return <Modal>
        <div className="flex flex-col gap-2 max-w-screen w-80">
            <SelfServiceFileUpload name="files" form={mediaModalForm}/>
            <Button label="Schließen" secondary={true} onClick={closes}
                    disabled={uploading || saving}/>
        </div>
    </Modal>;
}


export async function getServerSideProps(context: any) {
    const article = (await Cockpit.collectionGet('paper_articles', {filter: {_id: context.query.articleId}})).entries[0];
    const project = (await Cockpit.collectionGet('paper_projects', {filter: {_id: article.project._id}})).entries[0];
    const versions = (await Cockpit.collectionGet('paper_texts', {
        filter: {article: context.query.articleId},
        sort: {_created: -1}
    })).entries
        .map((entry, index) => index === 0 ? entry : {_id: entry._id, _created: entry._created});

    return article ? {props: {article, versions, project}} : {notFound: true}
}
