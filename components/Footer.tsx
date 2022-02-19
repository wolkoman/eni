import Link from 'next/link';
import React, {useEffect} from 'react';
import Responsive from './Responsive';
import {useUserStore} from '../util/use-user-store';

export default function Footer() {
  const [isLoggedIn, load] = useUserStore(state => [state.user?.active, state.load]);
  useEffect(() => load(), []);
  return <>
    <div className="pt-6 text-gray-600 mt-6">
      <Responsive>
        <div className="flex flex-col md:flex-row justify-between md:items-center">
        <div className="mb-5">
          Eine Neue Initiative.  Zusammenarbeit der Pfarren:<br/>
          <div className="text-sm mr-1 inline-block">Pfarre Emmaus am Wienerberg,</div>
          <div className="text-sm mr-1 inline-block">Pfarre Inzersdorf (St. Nikolaus),</div>
          <div className="text-sm mr-1 inline-block">Pfarre Inzersdorf-Neustift</div>
        </div>
            <Link href="/impressum"><div className="cursor-pointer underline hover:no-underline mb-5">Impressum</div></Link>
          {isLoggedIn
            ? <Link href="/intern"><div className="cursor-pointer underline hover:no-underline mb-5">Zum Mitgliedsbereich</div></Link>
            : <Link href="/login"><div className="cursor-pointer mb-5 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded transform hover:scale-105 transition-all">Login</div></Link>}
        </div>
      </Responsive>
    </div>
  </>;
}
