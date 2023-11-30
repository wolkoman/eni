"use client"

import React, {ReactNode} from 'react';
import Site from '../../components/Site';
import {useUserStore} from "../(store)/UserStore";
import {usePermission} from "../(shared)/UsePermission";
import {Permission} from "../(domain)/users/Permission";
import Link from "next/link";
import {Links} from "../(shared)/Links";


export function InternButton({href, label, onClick, children}: {
  href?: string,
  label?: string,
  onClick?: () => any,
  children?: ReactNode
}) {
  const inside = <div onClick={onClick} className="rounded text-lg">
    {label}{children}
  </div>;
  return href ? <Link href={href}>{inside}</Link> : <div onClick={onClick}>{inside}</div>;
}

export function InternPage() {
  const user = useUserStore(state => state.user);
  const permissions = user?.permissions;
  const [logout] = useUserStore(state => [state.logout]);
  usePermission([]);
  return <Site title="Mitgliedsbereich">
    <div className="text-4xl my-8 font-semibold">Hallo {user?.name?.split(' ')?.[0] ?? '😃'}!</div>
    <div className="grid lg:grid-cols-2 gap-6">
      <Section title="Termine" picture="icons/icon_calendar.svg">
        <InternButton href={Links.Termine} label="Ansehen"/>
        {permissions?.[Permission.CalendarAdministration] &&
            <InternButton href={Links.Terminvorschläge} label="Terminvorschläge"/>}
        {(permissions?.[Permission.Reader] || permissions?.[Permission.ReaderPlanning] || permissions?.[Permission.CommunionMinister]) &&
            <InternButton href={Links.DiensteÜbersicht} label="Liturgische Dienste"/>}
      </Section>
      <Section title="Wochenmitteilungen" picture="icons/icon_weekly.svg">
        <InternButton href={Links.Wochenmitteilungen()} label="Ansehen"/>
        <InternButton href={Links.Ankündigung} label="Ankündigung erstellen"/>
        {permissions?.[Permission.Editor] && <InternButton href={Links.WochenmitteilungenErstellen} label="Erstellen"/>}
      </Section>
      <Section title="Pfarrzeitschriften" picture="icons/icon_papers.svg">
        <InternButton href={Links.Pfarrzeitschriften} label="Ansehen"/>
        {permissions?.[Permission.Editor] && <InternButton href={Links.Projektplattform} label="Projektplattform"/>}
      </Section>
      {permissions?.[Permission.OrganBooking] &&
          <Section title="Musik in Inzersdorf" picture="icons/icon_music.svg">
        {permissions?.[Permission.OrganBooking] && <InternButton href={Links.Orgel} label="Orgel Buchung"/>}
      </Section>
      }
      {permissions?.[Permission.PrivateDocumentAccess] &&
          <Section title="Kanzlei" picture="icons/icon_office.svg">
              <InternButton href={Links.Scans} label="Gescannte Dokumente"/>
          </Section>
      }
      <Section title="Einstellungen" picture="icons/icon_settings.svg">
        <InternButton href={Links.Feedback} label="Feedback"/>
        {user?.is_person && <InternButton href={Links.PasswortÄndern} label="Passwort ändern"/>}
        {user && !user?.is_person && <InternButton href={Links.Cockpit} label="Cockpit"/>}
        <InternButton onClick={logout} label="Logout"/>
      </Section>
    </div>
  </Site>
}

function Section(props: {
  title: string;
  children: ReactNode
  picture?: string
}) {
  return <div className="border border-black/20 rounded-lg p-4 relative grid grid-cols-2">
    <div className=" grid place-items-center">
      <img src={props.picture} className="w-36" alt={props.picture}/>
    </div>
    <div>
      <div className="text-lg font-bold my-2">
        {props.title}
      </div>
      <div className="flex flex-col gap-1">
        {props.children}
      </div>
    </div>
  </div>
}
