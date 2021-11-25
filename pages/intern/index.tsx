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
      <Link href="/"><div className="h-32 bg-white shadow rounded-xl flex justify-center items-center text-lg cursor-pointer">Startseite</div></Link>
      {
        permissions[Permission.Articles] &&
        <Link href="intern/artikel"><div className="h-32 bg-white shadow rounded-xl flex justify-center items-center text-lg cursor-pointer">Artikel Importer</div></Link>
      }
      {
        permissions[Permission.OrganBooking] &&
        <Link href="intern/orgel"><div className="h-32 bg-white shadow rounded-xl flex justify-center items-center text-lg cursor-pointer">Orgel Buchung</div></Link>
      }
      {
        permissions[Permission.ExperimentalAccess] &&
        <Link href="intern/news"><div className="h-32 bg-white shadow rounded-xl flex justify-center items-center text-lg cursor-pointer">Wochenmitteilungen</div></Link>
      }
      <Link href="https://forms.gle/vCeFKfYwXL7E8ct7A"><div className="h-32 bg-white shadow rounded-xl flex justify-center items-center text-lg cursor-pointer">Feedback</div></Link>
      <div className="h-32 bg-white shadow rounded-xl flex justify-center items-center text-lg cursor-pointer" onClick={logout}>Logout</div>
    </div>
  </Site>
}