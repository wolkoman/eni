"use client"
import {Collections} from 'cockpit-sdk';
import React, {useEffect, useState} from 'react';
import Site from '../../../../components/Site';
import {useSearchParams} from "next/navigation";
import {useBeforeunload} from "react-beforeunload";
import {toast} from "react-toastify";
import Button from "../../../../components/Button";
import Responsive from "../../../../components/Responsive";
import {Hamburger} from "@/components/Hamburger";
import {AnimatePresence} from 'framer-motion';
import {useUserStore} from "@/store/UserStore";
import {Permission} from "@/domain/users/Permission";
import {saveFile} from "@/app/(shared)/BrowserBlobSaver";
import {fetchJson} from "@/app/(shared)/FetchJson";
import {Links} from "@/app/(shared)/Links";
import {WelcomeScreen} from "./WelcomeScreen";
import {MoreOptions} from "./MoreOptions";
import {MediaModal} from "./MediaModal";
import {Modal} from "./Modal";


export function EditorArticlePage(props: { article: Collections['paper_articles'], project: Collections['paper_projects'], versions: Collections['paper_texts'][] }) {

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
        return fetchJson(Links.ApiEditorSave, {json: {articleId: searchParams.get('articleId'), text}})
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
        return toast.promise(fetchJson(Links.ApiEditorSaveStatus, {
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
            .then(() => (window as any).location.reload())
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
                    {length === 0 ? <WelcomeScreen article={article} project={props.project}/> :
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
                                      articleId={article._id}
                                        editable={editable} onSave={saveAndDownload} saved={saved}
                                        permission={permission} status={status} disabled={statusLoading}
                                        onSaveStatusChange={saveStatus}
                                        onFinish={() => setFinishModalOpen(true)}
                                        openMediaModel={() => setMediaModalOpen(true)}
                                    />
                                </div>
                            </div>
                        </div>}
                </Responsive>
            </div>
            <div className="h-full ">
                <Responsive className="h-full relative">
                {mobilMenuOpen &&
                    <div className="bg-gray-200 absolute top-0 left-0 w-full p-4 md:hidden flex justify-center z-10">
                        <MoreOptions
                          articleId={article._id}
                          editable={editable} onSave={saveAndDownload} saved={saved} permission={permission}
                         status={status} disabled={statusLoading} onSaveStatusChange={saveStatus}
                         onFinish={() => setFinishModalOpen(true)}
                         openMediaModel={() => setMediaModalOpen(true)}
                        />
                    </div>}
                <textarea
                    readOnly={!editable}
                    className={`w-full h-full outline-none font-serif text-lg p-4 rounded ${{
                        unfinished: `border border-black/50`,
                        perfect: `border-2 border-green-700`,
                        excess: 'border-2 border-red-600',
                    }[note]}`}
                    onChange={(e:any) => setText(e.target.value)} defaultValue={props.versions[0]?.text ?? ''}>
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



