import React from 'react';
import {CalendarPage} from '../components/Calendar';
import Articles from '../components/Articles';
import Site from '../components/Site';
import Button from '../components/Button';
import Link from 'next/link';
import {Instagram} from '../components/Instagram';

export default function HomePage() {
  return <Site>
    <Articles/>
    <Parishes/>
    <CalendarPage/>
    <Instagram/>
    <div className="flex flex-col md:flex-row my-14">
      <Info title="Newsletter" image="./info-01.svg">
        <div className="mb-4">
          In unserem monatlichen Newsletter informieren wir kurz und prägnant über zukünftige, aktuelle und vergangene
          Geschehnisse in unseren drei Pfarren.
        </div>
        <Link href="/newsletter"><a><Button label="Newsletter abonnieren"/></a></Link>
      </Info>
      <Info title="Pfarrzeitung" image="./info-02.svg">
        <div className="mb-4">
          Ausführliche Berichte zum Pfarrleben, Diskussionen zur Weltkirche, Impulse zum Nachdenken und vieles mehr
          finden Sie in den Pfarrzeitungen der Pfarren.
        </div>
        <Link href="/pfarrzeitung"><a><Button label="Pfarrzeitungen ansehen"/></a></Link>
      </Info>
    </div>
  </Site>
}

function Parishes() {
  return <div className="grid grid-cols-3 gap-4 md:gap-16 py-12">
    {[
      {
        image: '/logos_Emmaus Stroke.svg',
        imageColor: '/logos_Emmaus Fade.svg',
        name: 'Pfarre Emmaus am Wienerberg',
        description: (x: string) => <>Die <b>{x}</b> wurde aus den Überresten der ehemaligen Wienerberger Ziegelfabrik
          errichtet.</>,
        address: 'Tesarekplatz 2, 1100 Wien'
      },
      {
        image: '/logos_Inzersdorf Stroke.svg',
        imageColor: '/logos_Inzersdorf Fade.svg',
        name: 'Pfarre Inzersdorf - St. Nikolaus',
        description: (x: string) => <>Die <b>{x}</b> ist mit dem Gründungsjahr 1217 eine der ältesten Pfarren der
          Erzdiözese Wien.</>,
        address: 'Inzersdorf Kirchenplatz 1, 1230 Wien'
      },
      {
        image: '/logos_Neustift Stroke.svg',
        imageColor: '/logos_Neustift Fade.svg',
        name: 'Pfarre Inzersdorf - Neustift',
        description: (x: string) => <>Die <b>{x}</b> entstand aus einer Teilung von der Pfarre Inzersdorf und wurde
          Maria, Hilfe der Christen geweiht.</>,
        address: 'Don-Bosco-Gasse 14, 1230 Wien'
      },
    ].map(parish => <div key={parish.name}>
      <div className="flex justify-center">
        <img src={parish.imageColor} className="pb-2 h-48 relative -top-4" alt={parish.name}/>
        <img src={parish.image} className="pb-2 h-44 absolute hidden md:block" alt={parish.name}/>
      </div>
      <div className="md:hidden leading-4 text-center font-semibold relative -top-8 text-lg">{parish.name}</div>
      <div className="hidden md:block">{parish.description(parish.name)}</div>
      <div className="leading-4 text-center relative -top-4 md:top-2 md:italic md:text-left">{parish.address}</div>
    </div>)}
  </div>;
}

const Info = ({title, image, children}: { title: string, image: string, children: any }) => {
  return <div className="px-3 text-lg mb-8">
    <div className="flex flex-row items-end mb-2">
      <img src={image} className="w-16"/>
      <div className="text-3xl ml-2 font-bold">{title}</div>
    </div>
    {children}
  </div>
}