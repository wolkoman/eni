import React from 'react';
import Link from 'next/link';
import {Permission, useUserStore} from '../../util/store';
import Site from '../../components/Site';
import {usePermission} from '../../util/usePermission';

export default function Intern() {
  const [permissions, user] = useUserStore(state => [state.permissions, state.user]);
  usePermission([]);
  return <Site>
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
      <Link href="/"><div className="h-32 bg-gray-200 flex justify-center items-center text-lg cursor-pointer">Startseite</div></Link>
      {
        permissions[Permission.Articles] &&
        <Link href="intern/artikel"><div className="h-32 bg-gray-200 flex justify-center items-center text-lg cursor-pointer">Artikel Importer</div></Link>
      }
    </div>
  </Site>
}