import React from 'react';
import {Calendar} from '../components/Calendar';
import Articles from '../components/Articles';
import Site from '../components/Site';
import Button from '../components/Button';
import Link from 'next/link';
import {InstagramFeed} from '../components/InstagramFeed';

export default function HomePage() {
  return <Site>
    <Articles/>
    <Parishes/>
    <Calendar/>
    <InstagramFeed/>
    <div className="flex flex-col md:flex-row my-14">
      <Info title="Newsletter" image="./info-01.svg">
        <div className="mb-4">
          In unserem monatlichen Newsletter informieren wir kurz und prägnant über zukünftige, aktuelle und vergangene
          Geschehnisse in unseren drei Pfarren.
        </div>
        <data id="mj-w-res-data" data-token="8f1b2140d89962bbed083c4c06b6edd4" className="mj-w-data"
              data-apikey="6LsO" data-w-id="J4h" data-lang="de_DE" data-base="https://app.mailjet.com"
              data-width="640" data-height="328" data-statics="statics"/>
        <div className="mj-w-button mj-w-btn" data-token="8f1b2140d89962bbed083c4c06b6edd4">
          <Button label="Newsletter abonnieren"/>
        </div>
      </Info>
      <Info title="Pfarrzeitung" image="./info-02.svg">
        <div className="mb-4">
          Ausführliche Berichte zum Pfarrleben, Diskussionen zur Weltkirche, Impulse zum Nachdenken und vieles mehr
          finden Sie in den Pfarrzeitungen der Pfarren.
        </div>
        <Link href="/pfarrzeitung"><Button label="Pfarrzeitungen ansehen"/></Link>
      </Info>
    </div>
  </Site>
}

function Parishes() {
  return <div className="grid grid-cols-3 gap-4 md:gap-16 py-12">
    {[
      {
        image: '/emmaus.png',
        name: 'Pfarre Emmaus am Wienerberg',
        description: (x: string) => <>Die <b>{x}</b> wurde aus den Überresten der ehemaligen Wienerberger Ziegelfabrik
          errichtet.</>
      },
      {
        image: '/inzersdorf.png',
        name: 'Pfarre Inzersdorf - St. Nikolaus',
        description: (x: string) => <>Die <b>{x}</b> ist mit dem Gründungsjahr 1217 eine der ältesten Pfarren der
          Erzdiözese Wien.</>
      },
      {
        image: '/neustift.png',
        name: 'Pfarre Inzersdorf - Neustift',
        description: (x: string) => <>Die <b>{x}</b> entstand aus einer Teilung von der Pfarre Inzersdorf und wurde
          Maria, Hilfe der Christen geweiht.</>
      },
    ].map(parish => <div key={parish.name}>
      <img src={parish.image} className="pb-2" alt={parish.name}/>
      <div className="md:hidden leading-4 text-center font-bold">{parish.name}</div>
      <div className="hidden md:block">{parish.description(parish.name)}</div>
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