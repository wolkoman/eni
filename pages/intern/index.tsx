import React from 'react';
import Site from '../../components/Site';
import {usePermission} from '../../util/use-permission';
import {Permission} from '../../util/verify';
import {useAuthenticatedUserStore, useUserStore} from '../../util/use-user-store';
import {InternButton} from "../../components/InternButton";


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
            {(permissions?.[Permission.Reader] || permissions?.[Permission.ReaderPlanning] || permissions?.[Permission.CommunionMinister]) &&
                <InternButton href="intern/reader/my" label="Liturgische Dienste"/>}
            {permissions?.[Permission.OrganBooking] && <InternButton href="intern/orgel" label="Orgel Buchung"/>}
            {permissions?.[Permission.Editor] && <InternButton href="intern/editor" label="Redaktion"/>}
            {permissions?.[Permission.LimitedEventEditing] &&
                <InternButton href="intern/limited-event-editing" label="Musik Inzersdorf"/>}
            <InternButton href="https://forms.gle/vCeFKfYwXL7E8ct7A" label="Feedback"/>
            {user?.is_person && <InternButton href="intern/change-password" label="Passwort ändern"/>}
            {user && !user?.is_person && <InternButton href="https://data.eni.wien" label="Cockpit"/>}
            {permissions?.[Permission.Editor] && <InternButton href="intern/weekly" label="Wochenmitteilung"/>}
            <InternButton onClick={logout} label="Logout"/>
        </div>
    </Site>
}

