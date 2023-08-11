import {useUserStore} from "../../(store)/UserStore";
import {useState} from "../../(shared)/use-state-util";
import {Collections} from "cockpit-sdk";
import React, {useEffect} from "react";
import {EniLoading} from "../../../components/Loading";
import {getCalendarInfo} from "../../(domain)/events/CalendarInfo";
import Link from "next/link";
import Button from "../../../components/Button";
import {loadAnnouncements} from "./LoadAnnouncements";
import {hideAnnouncement} from "./hideAnnouncement";


export function AnnouncementsEntries() {

    const [ann, setAnn] = useState<Collections["announcements"][] | null>(null);

    useEffect(() => {
        loadAnnouncements().then(({entries}) => setAnn(entries));
    }, [])

    async function hide(id: string) {
        hideAnnouncement(id).then()
        setAnn(rest => rest?.filter(a => a._id !== id) ?? null);
    }

    return <>
        <div className="text-3xl font-bold my-4 mt-10">Ankündigungen</div>
        <div className="flex flex-col gap-4">
            {ann === null && <EniLoading/>}
            {ann?.length === 0 && <div>Es sind keine Ankündigungen eingereicht.</div>}
            {ann?.map(announcement => <div className="px-6 py-4 bg-black/[2%] rounded-lg flex flex-col"
                                           key={announcement._id}>
                <div
                    className="mb-1 font-bold">{getCalendarInfo(announcement.parish as any).fullName}: {announcement.byName}</div>
                <div className="mb-2">{announcement.description}</div>
                {announcement.files.map(file => <Link href={file}>
                    <div className="underline hover:no-underline">{file}</div>
                </Link>)}
                <div className="flex justify-end gap-2">
                    <Button label="Erledigt" onClick={() => hide(announcement._id)}/>
                </div>
            </div>)}
        </div>
    </>;
}
