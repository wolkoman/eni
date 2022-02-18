import React from 'react';
import Link from 'next/link';
import Site from '../../components/Site';
import {usePermission} from '../../util/use-permission';
import {Permission} from '../../util/verify';
import {useUserStore} from '../../util/use-user-store';

export default function Intern() {
  const [permissions, user, logout] = useUserStore(state => [state.permissions, state.user, state.logout]);
  usePermission([]);
  return <Site title="Mitgliedsbereich">
    <div>
      <div className="text-4xl my-8">Hallo {user?.name?.split(" ")?.[0] ?? "Benutzer:in"}!</div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      <InternButton href="/" label="Startseite"/>
      <InternButton href="/termine" label="Termine"/>
      {permissions[Permission.Articles] && <InternButton href="intern/artikel" label="Importer"/>}
      {permissions[Permission.OrganBooking] && <InternButton href="intern/orgel" label="Orgel Buchung"/>}
      {permissions[Permission.ExperimentalAccess] && <InternButton href="intern/news" label="Wochenmitteilung"/>}
      <InternButton href="//forms.gle/vCeFKfYwXL7E8ct7A" label="Feedback"/>
      <InternButton onClick={logout} label="Logout"/>
    </div>
  </Site>
}

function InternButton({href, label, onClick}: {href?: string, label: string, onClick?: () => any}) {
  return <Link href={href ?? ''}>
    <div onClick={onClick} className="h-32 bg-white shadow rounded-xl flex justify-center items-center text-lg cursor-pointer text-xl">
      {label}
    </div>
  </Link>;
}
