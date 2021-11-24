import React from 'react';
import {EventsPage} from '../components/Calendar';
import Articles from '../components/Articles';
import Site from '../components/Site';
import Button from '../components/Button';
import Link from 'next/link';
import {Instagram} from '../components/Instagram';
import {ComingUpComponent} from '../components/ComingUp';
import {Parishes} from '../components/Parishes';
import {TopBranding} from '../components/TopBranding';

export default function HomePage() {
  return <Site>
    <TopBranding/>
    <Articles/>
    <Parishes/>
    <ComingUpComponent/>
    <EventsPage/>
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

const Info = ({title, image, children}: { title: string, image: string, children: any }) => {
  return <div className="px-3 text-lg mb-8">
    <div className="flex flex-row items-end mb-2">
      <img src={image} className="w-16"/>
      <div className="text-3xl ml-2 font-bold">{title}</div>
    </div>
    {children}
  </div>
}