import React from 'react';
import Link from 'next/link';
import {useUserStore} from '../../util/store';
import Site from '../../components/Site';
import {usePermission} from '../../util/usePermission';
import {Permission} from '../../util/verify';
import {useRouter} from 'next/router';

export default function Intern() {
  const [permissions, user, logout] = useUserStore(state => [state.permissions, state.user, state.logout]);
  const router = useRouter();
  usePermission([]);
  return <Site title="Mitgliedsbereich">
    <div>
      <div className="text-4xl my-8">Hallo {user?.name?.split(" ")?.[0] ?? "Benutzer:in"}!</div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
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
    <div onClick={onClick} className="h-32 bg-white shadow rounded-xl flex justify-center items-center text-lg cursor-pointer">
      {label}
    </div>
  </Link>;
}
