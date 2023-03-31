import React, {useEffect} from 'react';
import {usePermission} from '../../util/use-permission';
import Site from '../../components/Site';
import Button from '../../components/Button';
import {Permission} from '../../util/verify';
import {TemplateHandler} from 'easy-template-x';
import sanitize from 'sanitize-html';
import {useState} from '../../util/use-state-util';
import {getWeekDayName} from '../../components/calendar/Calendar';
import {groupEventsByDate, useAuthenticatedCalendarStore} from '../../util/use-calendar-store';
import {saveFile} from "../../util/save-file";
import {CalendarEvent, CalendarGroup, CalendarTag} from "../../util/calendar-types";
import {useAuthenticatedUserStore, useUserStore} from "../../util/use-user-store";
import CockpitSDK, {Collections} from "cockpit-sdk";
import {cockpit} from "../../util/cockpit-sdk";
import Link from "next/link";
import {EniLoading} from "../../components/Loading";
import PDFMerger from 'pdf-merger-js/browser';
import {toast} from "react-toastify";
import {fetchJson} from "../../util/fetch-util";
import {getCalendarInfo} from "../../util/calendar-info";

export default function InternArticles() {
    usePermission([Permission.Admin]);
    const [data, , setPartialData] = useState({start: new Date(), end: new Date()});
    const {items: events, loaded} = useAuthenticatedCalendarStore()
    const {user} = useAuthenticatedUserStore()

    function pad(num: number) {
        return `${num < 10 ? '0' : ''}${num}`
    }

    function toTime(dateTime: string) {
        const date = new Date(dateTime);
        return `${pad(date.getHours())}:${pad(date.getMinutes())}`
    }

    function toCalEevent(event: CalendarEvent) {
        const special = event.groups.includes(CalendarGroup.Messe);
        const isDescription = event.description.toString().trim().length > 0;
        const description = `\n${sanitize(event.description.replaceAll("<br/>", "\n").trim(), {allowedTags: []})}`
        return {
            [special ? 'specialtime' : 'time']: toTime(event.start.dateTime),
            [special ? 'specialtitle' : 'title']: event.summary,
            description: (event.mainPerson ? `\nmit ${event.mainPerson}` : '') + (isDescription ? description : '')
        };
    }

    async function generate(file: string) {
        const response = await fetch(file);
        const templateFile = await response.blob();
        const from = data.start.toISOString().split("T")[0].split('-').reverse().join('.').substring(0, 5);
        const to = data.end.toISOString().split("T")[0].split('-').reverse().join('.').substring(0, 10);
        const year = new Date(data.end.getFullYear(), 0, 1);
        const days = Math.floor((data.end.getTime() - year.getTime()) / (24 * 60 * 60 * 1000));
        const week = Math.ceil((data.end.getDay() + days) / 7);
        const wordData = {
            daterange: `${from}. - ${to}.`,
            kw: week,
            year: data.end.getFullYear(),
            event: Object.entries(groupEventsByDate(events))
                .filter(([date]) => data.start.getTime() <= new Date(date).getTime() && data.end.getTime() >= new Date(date).getTime())
                .map(([date, events]) => ({date, events: events.filter(e => e.visibility === "public")}))
                .map(({date, events: allEvents}) => {
                    const day = new Date(date).getDay();
                    const events = allEvents.filter(event => !event.tags.includes(CalendarTag.cancelled));
                    return ({
                        sundaydate: day === 0 ? `${getWeekDayName(day)}, ${date.split('-').reverse().join('.').substring(0, 5)}.` : '',
                        date: day !== 0 ? `${getWeekDayName(day)}, ${date.split('-').reverse().join('.').substring(0, 5)}.` : '',
                        emmaus: events.filter(event => event.calendar === 'emmaus').map(toCalEevent),
                        inzersdorf: events.filter(event => event.calendar === 'inzersdorf').map(toCalEevent),
                        neustift: events.filter(event => event.calendar === 'neustift').map(toCalEevent),
                    });
                }),
        };

        const handler = new TemplateHandler();
        const doc = await handler.process(templateFile, wordData as any);

        saveFile('wochenmitteilung.docx', doc);
    }


    return <Site title="Wochenmitteilungen" narrow={true}>
        <div className="">
            <div className="text-3xl font-bold my-4">Vorlage erstellen</div>
            <div>
                <div className="mt-4 text-sm">Start</div>
                <input type="date" className="bg-gray-200 px-3 py-1 rounded"
                       onChange={(e) => setPartialData({start: new Date(e.target.value)})}/>
            </div>
            <div>
                <div className="mt-4 text-sm">Ende</div>
                <input type="date" className="bg-gray-200 px-3 py-1 rounded"
                       onChange={(e) => setPartialData({end: new Date(e.target.value)})}/>
            </div>
            <Button className="mt-4" label="Generieren" onClick={() => generate("/eni.docx")} disabled={!loaded}/>
            <AnnouncementsEntries/>
            <AnnouncementsUpload/>
            <AnnouncementsSend/>
        </div>
    </Site>;
}

function AnnouncementsSend() {

    const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');
    const [message, setMessage] = useState("Liebe Pfarrgemeinde,\n\nwir übersenden Ihnen den Link zu den aktuellen Wochenmitteilungen.\n\nMit freundlichen Grüßen,\nKarin Bauer");

    function load() {
        if(state !== 'idle') return;
        setState('loading');
        fetchJson("/api/weekly/send-mail", {json: {message}})
            .then(({errorMessage}) => {
                setState(errorMessage ? 'idle' : 'success');
                if(errorMessage) toast.error(errorMessage)
            })
            .catch(() => setState('idle'));
    }

    return <>
        <div className="text-3xl font-bold my-4 mt-10">Senden</div>
        <textarea onChange={({target}) => setMessage(target.value)} value={message} className="block my-4 border border-black/30 px-2 py-1 rounded outline-none w-full h-48"/>
        <Button label="Senden" sure={true} disabled={state !== 'idle'} onClick={load}/>
        {state === 'success' && <div className="my-4 bg-black/5 p-4 rounded-lg">
            Die Mails wurden gesendet!
        </div>}
    </>;
}


function AnnouncementsUpload() {

    const apiKey = useUserStore(state => state.user?.api_key)
    const [uploadPossible, setUploadPossible] = useState<'idle' | 'loading' | 'success'>('idle');

    async function onUploadFile(file: File) {
        setUploadPossible('loading');
        const files = new FormData();
        const splittingSuccess = await Promise.all([['1', '2'], ['1', '3'], ['1', '4']].map(async (pages, i) => {
            const merger = new PDFMerger();
            await merger.add(file, pages)
            await merger.setMetadata({
                producer: "eni.wien - Wochenmitteilung Generator",
                title: "Wochenmitteilungen"
            });
            files.append("WM" + i + ".pdf", await merger.saveAsBlob(), "WM" + i + ".pdf")
            return true;
        })).catch(() => {
            toast.error("Die Datei muss ein PDF mit vier Seiten sein.")
            setUploadPossible('idle');
        })
        if (!splittingSuccess) return;

        const adminCockpit = new CockpitSDK({host: cockpit.host, accessToken: apiKey});
        const uploadedFiles = await fetch('https://api.eni.wien/files-v0/upload.php', {
            method: 'POST',
            body: files,
        })
            .then(res => res.json())
            .then(data => data.map((file: string) => `https://api.eni.wien/files-v0/uploads/${file}`))
            .catch(err => setUploadPossible('idle'));

        if (!uploadedFiles) return;
        const date = new Date().toISOString().split("T")[0];
        const existing = await adminCockpit.collectionGet("weekly", {filter: {date}}).then(({entries}) => entries);
        await adminCockpit.collectionSave(`weekly`, {
            date,
            _id: existing?.[0]?._id,
            emmaus: uploadedFiles[0],
            inzersdorf: uploadedFiles[1],
            neustift: uploadedFiles[2]
        })
        setUploadPossible('success');
    }

    return <>
        <div className="text-3xl font-bold my-4 mt-10">Hochladen</div>
        {uploadPossible === 'idle' && <div>
            <div className="my-4">
                Laden Sie hier das fertiggestellte 4-seitige PDF der aktuellen Wochenmitteilungen hoch.
                Danach sind die Wochenmitteilungen auf der Website online.
            </div>
            <input type="file" onChange={e => e.target.files?.[0] ? onUploadFile(e.target.files[0]) : null}/>
        </div>}

        {uploadPossible === 'loading' && <EniLoading/>}
        {uploadPossible === 'success' && <div> Der Upload war erfolgreich! </div>}
    </>;
}


function AnnouncementsEntries() {

    const apiKey = useUserStore(state => state.user?.api_key)
    const [ann, setAnn] = useState<Collections["announcements"][] | null>(null);

    useEffect(() => {
        if (!apiKey) return;
        cockpit.collectionGet('announcements', {
            token: apiKey,
            filter: {hidden: false}
        }).then(({entries}) => setAnn(entries));
    }, [apiKey])

    function hide(id: string) {
        const obj = ann?.find(announcement => announcement._id === id)
        const adminCockpit = new CockpitSDK({host: cockpit.host, accessToken: apiKey});
        adminCockpit.collectionSave(('announcements') as any, {...obj, hidden: true});
        setAnn(rest => rest?.filter(a => a._id !== id) ?? null);
    }

    return <>
        <div className="text-3xl font-bold my-4 mt-10">Ankündigungen</div>
        <div className="flex flex-col gap-4">
            {ann === null && <EniLoading/>}
            {ann?.length === 0 && <div>Es sind keine Ankündigungen eingereicht.</div>}
            {ann?.map(announcement => <div className="px-6 py-4 bg-black/[2%] rounded-lg flex flex-col" key={announcement._id}>
                <div className="mb-1 font-bold">{getCalendarInfo(announcement.parish as any).fullName}: {announcement.byName}</div>
                <div className="mb-2">{announcement.description}</div>
                {announcement.files.map(file => <Link href={"https://api.eni.wien/files-v0/uploads/" + file}>
                    <div className="underline hover:no-underline">{file}</div>
                </Link>)}
                <div className="flex justify-end gap-2">
                    <Button label="Erledigt" onClick={() => hide(announcement._id)}/>
                </div>
            </div>)}
        </div>
    </>;
}
