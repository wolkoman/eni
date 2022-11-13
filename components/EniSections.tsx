import {Section} from './Section';
import Link from 'next/link';
import React from 'react';
import Responsive from "./Responsive";
import {getCalendarInfo} from "../util/calendar-info";
import Button from "./Button";

export function EniSections() {
    return <Responsive><Section title="Mitteilungen">
        <div className="grid lg:grid-cols-2 my-12 gap-24 lg:gap-12 text-center">
            <div className="flex flex-col items-center">
                <img src="./Wochenblatt.svg" className="h-44 mb-12"/>
                <div className="text-3xl font-bold">
                    Wochenmitteilungen
                </div>
                <div className="text-lg my-3">
                    Gottesdienste, Veranstaltungen und Ankündigungen jede Woche neu.
                    Sie können sich auch gerne für den Newsletter registrieren: Schicken Sie dazu eine Mail mit
                    der gewünschten Pfarre an die kanzlei@eni.wien.
                </div>
                <div className="flex space-x-2">
                    {['emmaus', 'inzersdorf', 'neustift'].map(id => getCalendarInfo(id as any)).map(info =>
                        <Link href={`/api/weekly?parish=${info.id}`} key={info.id}>
                            <Button label={info.shortName} className={info.className}/>
                        </Link>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-center">
                <img src="./Zeitungen.svg" className="h-44 mb-12"/>
                <div className="text-3xl font-bold">
                    Pfarrzeitungen
                </div>
                <div className="text-lg my-3">
                    Ausführliche Berichte zum Pfarrleben, Diskussionen zur Weltkirche, Impulse zum Nachdenken
                    und vieles mehr finden Sie in den Pfarrzeitungen der Pfarren.
                </div>
                <div className="flex space-x-2">
                    {['emmaus', 'inzersdorf', 'neustift'].map(id => getCalendarInfo(id as any)).map(info =>
                        <Link key={info.id} href={{
                            emmaus: "https://emmaus.wien/#pfarrzeitung",
                            inzersdorf: "https://www.pfarresanktnikolaus.at/wp/?page_id=89",
                            neustift: "https://www.erzdioezese-wien.at/pages/pfarren/9233/pfarrblatt"
                        }[info.id as 'emmaus']}>
                            <Button label={{
                                emmaus: "Emmausbote",
                                inzersdorf: "BLICKpunkt",
                                neustift: "IN-News"
                            }[info.id as 'emmaus']} className={info.className}/>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    </Section></Responsive>;
}