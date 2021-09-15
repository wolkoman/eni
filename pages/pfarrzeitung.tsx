import React from 'react';
import Site from '../components/Site';
import Link from 'next/link';

export default function HomePage() {
  return <Site title="Pfarrzeitungen">
    <div>
      Ausführliche Berichte zum Pfarrleben, Diskussionen zur Weltkirche, Impulse zum Nachdenken und vieles mehr
      finden Sie in den Pfarrzeitungen der Pfarren.
    </div>
    <div className="grid md:grid-cols-3 gap-4 my-4 h-80 text-3xl font-serif">
      <Link href="https://tesarekplatz.at/aktuell/emmausbote">
        <div className="border-4 border-primary1 p-10 rounded-xl cursor-pointer">
          Der Emmausbote
        </div>
      </Link>
      <Link href="https://www.pfarresanktnikolaus.at/wp/?page_id=89">
        <div className="border-4 border-primary2 p-10 rounded-xl cursor-pointer">
          Blickpunkt
        </div>
      </Link>
      <Link href="https://www.erzdioezese-wien.at/pages/pfarren/9233/pfarrblatt">
        <div className="border-4 border-primary3 p-10 rounded-xl cursor-pointer">
          Inzersdorf-Neustift News
        </div>
      </Link>
    </div>
  </Site>
}