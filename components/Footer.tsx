import Link from 'next/link';
import React, {useEffect} from 'react';
import Responsive from './Responsive';
import {useUserStore} from '../util/store';

export default function Footer(props: {}) {
  const [isLoggedIn, load] = useUserStore(state => [state.user?.active, state.load]);
  useEffect(() => load(), []);
  return <>
    <div className="pt-6 text-gray-600 mt-24" style={{background: "#f5f5f5"}}>
      <Responsive>
        <div className="flex flex-col md:flex-row justify-between md:items-center">
        <div className="mb-5">
          <strong>E</strong>ine <strong>N</strong>eue <strong>I</strong>nitiative.  Zusammenarbeit der Pfarren:<br/>
          <div className="text-sm mr-1 inline-block">Pfarre Emmaus am Wienerberg,</div>
          <div className="text-sm mr-1 inline-block">Pfarre Inzersdorf (St. Nikolaus),</div>
          <div className="text-sm mr-1 inline-block">Pfarre Inzersdorf-Neustift</div>
        </div>
            <Link href="impressum"><div className="cursor-pointer underline hover:no-underline mb-5">Impressum</div></Link>
          {isLoggedIn
            ? <Link href="/intern"><div className="cursor-pointer underline hover:no-underline mb-5">Zum Mitgliedsbereich</div></Link>
            : <Link href="/login"><div className="cursor-pointer underline hover:no-underline mb-5">Login</div></Link>}
        </div>
      </Responsive>
    </div>
  </>;
}
