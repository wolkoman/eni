import {useUserStore} from "../../(store)/UserStore";
import {useState} from "../../(shared)/use-state-util";
import {Collections} from "cockpit-sdk";
import React, {useEffect} from "react";
import {EniLoading} from "../../../components/Loading";
import {getCalendarInfo} from "../../(domain)/events/CalendarInfo";
import Link from "next/link";
import Button from "../../../components/Button";
import {loadAnnouncements} from "./loadAnnouncements";
import {hideAnnouncement} from "./hideAnnouncement";
import {ParishDot} from "../../../components/calendar/ParishDot";


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
            {ann?.map(announcement => <div
              className="p-6 border border-black/20 rounded-lg flex flex-col"
              key={announcement._id}
            >
                <div className="mb-2 font-bold flex items-center gap-2">
                    <ParishDot info={getCalendarInfo(announcement.parish as any)} private={false} small={true}/>
                    {announcement.byName}
                </div>
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
