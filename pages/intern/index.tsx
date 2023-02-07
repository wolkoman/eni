import React, {useEffect, useState} from 'react';
import Site from '../../components/Site';
import {usePermission} from '../../util/use-permission';
import {Permission} from '../../util/verify';
import {useAuthenticatedUserStore, useUserStore} from '../../util/use-user-store';
import {InternButton} from "../../components/InternButton";
import {cockpit} from "../../util/cockpit-sdk";
import CockpitSDK, {Collections} from "cockpit-sdk";
import Button from "../../components/Button";
import Link from "next/link";

function AnnouncementsAdmin() {

    const apiKey = useUserStore(state => state.user?.api_key)
    const [ann, setAnn] = useState<Collections["announcements"][]>([]);

    useEffect(() => {
        if (!apiKey) return;
        cockpit.collectionGet('announcements', {
            token: apiKey,
            filter: {hidden: false}
        }).then(({entries}) => setAnn(entries));
    }, [apiKey])

    function hide(id: string) {
        const obj = ann.find(announcement => announcement._id === id)
        const adminCockpit = new CockpitSDK({host: cockpit.host, accessToken: apiKey});
        adminCockpit.collectionSave(('announcements') as any, {...obj, hidden: true});
        setAnn(rest => rest.filter(a => a._id !== id));
    }

    return <>
        <div className="my-8 text-xl">Ankündigungen</div>
        <div className="flex flex-col gap-4">
            {ann.map(announcement => <div className="px-6 py-4 bg-black/[2%] rounded-lg flex flex-col">
                <div className="mb-1 italic">{announcement.mail}</div>
                <div className="font-bold my-2">{announcement.description}</div>
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

export default function Intern() {
    const {user} = useAuthenticatedUserStore();
    const permissions = user?.permissions;
    const [logout] = useUserStore(state => [state.logout]);
    usePermission([]);
    return <Site title="Mitgliedsbereich">
        <div>
            <div className="text-4xl my-8">Hallo {user?.name?.split(' ')?.[0] ?? 'Benutzer:in'}!</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <InternButton href="/" label="Startseite"/>
            <InternButton href="/termine" label="Termine"/>
            {permissions?.[Permission.CalendarAdministration] && <InternButton href="intern/event-suggestions" label="Terminvorschläge"/>}
            <InternButton href="/intern/announcement" label="Ankündigung für die Wochenmitteilungen"/>
            {(permissions?.[Permission.Reader] || permissions?.[Permission.ReaderPlanning]) &&
                <InternButton href="intern/reader/my" label="Liturgische Dienste"/>}
            {permissions?.[Permission.OrganBooking] && <InternButton href="intern/orgel" label="Orgel Buchung"/>}
            {permissions?.[Permission.Editor] && <InternButton href="intern/editor" label="Redaktion"/>}
            {permissions?.[Permission.LimitedEventEditing] &&
                <InternButton href="intern/limited-event-editing" label="Musik Inzersdorf"/>}
            <InternButton href="https://forms.gle/vCeFKfYwXL7E8ct7A" label="Feedback"/>
            {user?.is_person && <InternButton href="intern/change-password" label="Passwort ändern"/>}
            {user && !user?.is_person && <InternButton href="https://data.eni.wien" label="Cockpit"/>}
            <InternButton onClick={logout} label="Logout"/>
        </div>
        {permissions?.[Permission.Admin] && <>
            <div className="my-8 text-xl">Administration</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <InternButton href="intern/artikel" label="Importer"/>
                <InternButton href="intern/weekly" label="Wochenmitteilung"/>
            </div>
        </>}
        {permissions?.[Permission.CalendarAdministration] && <AnnouncementsAdmin/>}
    </Site>
}

