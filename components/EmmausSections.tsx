import {Section} from './Section';
import Link from 'next/link';
import React from 'react';
import Responsive from "./Responsive";
import {Collections} from "cockpit-sdk";
import {getCockpitResourceUrl} from "./Articles";
import Button from "./Button";

import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";

export function EmmausSections(props: { emmausbote: Collections['Emmausbote'][] }) {
    const paper = props.emmausbote.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    return <Responsive>
        <Section title="Mitteilungen" id="mitteilungen">
            <div className="grid lg:grid-cols-2 my-12 gap-24 lg:gap-12 text-center">
                <div className="flex flex-col items-center">
                    <img src="./logo/wochenblatt.svg" className="h-44 mb-12"/>
                    <div className="text-3xl font-bold">
                        Wochenmitteilungen
                    </div>
                    <div className="text-lg my-3">
                        Gottesdienste, Veranstaltungen und Ankündigungen jede Woche neu.
                        Sie können sich auch gerne für den Newsletter registrieren: Schicken Sie dazu eine Mail mit
                        dem Betreff "Wochenmitteilung Emmaus" an kanzlei@eni.wien.
                    </div>
                    <div className="flex space-x-2">
                        {[CalendarName.EMMAUS].map(id => getCalendarInfo(id as any)).map(info =>
                            <Link href={`/api/weekly?parish=${info.id}`} key={info.id}>
                                <Button label="Ansehen" className={info.className}/>
                            </Link>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <img src={getCockpitResourceUrl(paper.preview.path)} className="w-44 p-4 rounded"/>
                    <div className="text-3xl font-bold">
                        Der Emmausbote
                    </div>
                    <div className="text-lg my-3">
                        Ausführliche Berichte zum Pfarrleben, Diskussionen zur Weltkirche, Impulse zum Nachdenken
                        und vieles mehr finden Sie im Emmausboten.
                    </div>
                    <div className="flex space-x-2">
                        <Link href={getCockpitResourceUrl(paper.file)}>
                            <Button label="Ansehen" className={getCalendarInfo(CalendarName.EMMAUS).className}/>
                        </Link>
                        <Link href="/archiv">
                            <Button label="Archiv"/>
                        </Link>
                    </div>
                </div>
            </div>
        </Section>
        </Responsive>;
}
