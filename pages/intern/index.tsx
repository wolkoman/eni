import React from 'react';
import Site from '../../components/Site';
import {usePermission} from '../../util/use-permission';
import {Permission} from '../../util/verify';
import {useUserStore} from '../../util/use-user-store';
import {InternButton} from "../../components/InternButton";

export default function Intern() {
    const [permissions, user, logout] = useUserStore(state => [state.user?.permissions, state.user, state.logout]);
    usePermission([]);
    return <Site title="Mitgliedsbereich">
        <div>
            <div className="text-4xl my-8">Hallo {user?.name?.split(' ')?.[0] ?? 'Benutzer:in'}!</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <InternButton href="/" label="Startseite"/>
            <InternButton href="/termine" label="Termine"/>
            {(permissions?.[Permission.Reader] || permissions?.[Permission.ReaderPlanning]) && <InternButton href="intern/reader/my" label="Lektor:innen"/>}
            {permissions?.[Permission.OrganBooking] && <InternButton href="intern/orgel" label="Orgel Buchung"/>}
            {permissions?.[Permission.Editor] && <InternButton href="intern/editor" label="Redaktion"/>}
            {permissions?.[Permission.LimitedEventEditing] && <InternButton href="intern/limited-event-editing" label="Musik Inzersdorf"/>}
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
    </Site>
}

