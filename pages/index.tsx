import React from 'react';
import Articles from '../components/Articles';
import Site from '../components/Site';
import Button from '../components/Button';
import Link from 'next/link';
import {Instagram} from '../components/Instagram';
import {Parishes} from '../components/Parishes';
import {TopBranding} from '../components/TopBranding';
import Responsive from '../components/Responsive';
import {ComingUp} from '../components/calendar/ComingUp';

export default function HomePage() {
  return <Site responsive={false}>
    <Responsive>
      <TopBranding/>
      <Articles/>
      <Parishes/>
      <ComingUp/>
    </Responsive>
    <Instagram/>
    <Responsive>
      <div className="grid md:grid-cols-2 gap-4 my-14">
        <Info title="Wochenmitteilungen" image="./info-01.svg">
          <div className="mb-4">
            Gottesdienste, Veranstaltungen und Ankündigungen jede Woche neu in Ihr Postfach.
            Schicken Sie eine Mail mit der gewünschten Pfarre an die Kanzlei und bleiben Sie up to date.
          </div>
          <a href="mailto://kanzlei@eni.wien"><Button label="Mail schicken"/></a>
        </Info>
        <Info title="Pfarrzeitung" image="./info-02.svg">
          <div className="mb-4">
            Ausführliche Berichte zum Pfarrleben, Diskussionen zur Weltkirche, Impulse zum Nachdenken und vieles mehr
            finden Sie in den Pfarrzeitungen der Pfarren.
          </div>
          <Link href="/pfarrzeitung"><a><Button label="Pfarrzeitungen ansehen"/></a></Link>
        </Info>
      </div>
    </Responsive>
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