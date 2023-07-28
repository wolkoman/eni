"use client"

import {Section} from './Section';
import Link from 'next/link';
import React from 'react';
import Responsive from "./Responsive";
import Button from "./Button";
import {Personal} from "./Personal";
import Image from "next/image";
import {motion} from 'framer-motion';
import {CalendarName, getCalendarInfo} from "../app/termine/CalendarInfo";

export function EniSections() {
    return <Responsive>
            <div className="grid lg:grid-cols-2 my-12 gap-24 lg:gap-12 text-center" id="wochenmitteilungen">
                <div className="flex flex-col items-center">
                    <img src="./logo/wochenblatt.svg" className="h-44 mb-12"/>
                    <div className="text-3xl font-bold">
                        Wochen&shy;mitteilungen
                    </div>
                    <div className="text-lg my-3 grow">
                        Gottesdienste, Veranstaltungen und Ankündigungen jede Woche neu.
                        Sie können sich auch gerne für den Newsletter registrieren: Schicken Sie dazu eine Mail mit
                        der gewünschten Pfarre an kanzlei@eni.wien.
                    </div>
                    <div className="flex flex-col lg:flex-row gap-2">
                        {['emmaus', 'inzersdorf', 'neustift'].map(id => getCalendarInfo(id as any)).map(info =>
                            <Link href={`/api/weekly?parish=${info.id}`} key={info.id}>
                                <Button label={<div className="flex gap-2 items-center">
                                    <Image src={info.dot} alt="Emmaus" width={20} height={20}/>
                                    {info.shortName}
                                </div>}/>
                            </Link>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <img src="./logo/zeitungen.svg" className="h-44 mb-12"/>
                    <div className="text-3xl font-bold">
                        Pfarr&shy;zeitungen
                    </div>
                    <div className="text-lg my-3 grow">
                        Ausführliche Berichte zum Pfarrleben, Diskussionen zur Weltkirche, Impulse zum Nachdenken
                        und vieles mehr finden Sie in den Pfarrzeitungen der Pfarren.
                    </div>
                    <div className="flex flex-col lg:flex-row gap-2">
                        {['emmaus', 'inzersdorf', 'neustift'].map(id => getCalendarInfo(id as any)).map(info =>
                            <Link key={info.id} href={{
                                emmaus: "https://emmaus.wien/#pfarrzeitung",
                                inzersdorf: "https://www.pfarresanktnikolaus.at/wp/?page_id=89",
                                neustift: "https://www.erzdioezese-wien.at/pages/pfarren/9233/pfarrblatt"
                            }[info.id as 'emmaus']}>
                                <Button label={<div className="flex gap-2">
                                    <Image src={info.dot} alt="Emmaus" width={20} height={20}/>
                                    {{
                                        emmaus: "Emmausbote",
                                        inzersdorf: "BLICKpunkt",
                                        neustift: "IN-News"
                                    }[info.id as 'emmaus']}
                                </div>}/>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        <Personal/>
        <Section title="Pfarren">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
                <Parish name={CalendarName.EMMAUS} index={0}/>
                <Parish name={CalendarName.INZERSDORF} index={1}/>
                <Parish name={CalendarName.NEUSTIFT} index={2}/>
            </div>
        </Section>
    </Responsive>;
}

function Parish(props: { name: CalendarName; index: number }) {
    const info = getCalendarInfo(props.name);
    return <div className="flex flex-col items-center text-center w-full">
        <div className={"rounded-lg overflow-hidden h-44 relative w-full " + info.className}>
            <motion.div
                style={{backgroundImage: `url(${info.image})`}}
                className="w-full h-full rounded-lg bg-contain bg-no-repeat bg-bottom"
                whileInView={{translateY: 0}}
                transition={{delay: 0.2 * props.index, bounce: 0}}
                initial={{translateY: 150}}
            />
        </div>
        <div className="text-xl font-bold mt-4">{info.fullName}</div>
        <div className="italic">{info.address}</div>
        <Link href={`${info.websiteUrl}`}>
            <div className="underline hover:no-underline cursor-pointer">{info.websiteDisplay}</div>
        </Link>
    </div>
}
