import {Section} from './Section';
import Link from 'next/link';
import React from 'react';
import Responsive from "./Responsive";
import {Collections} from "cockpit-sdk";
import {getCalendarInfo} from "../util/calendar-info";
import {getCockpitImageUrl} from "./Articles";
import Button from "./Button";

export function EmmausSections(props: { weeklies: Collections['weekly'][] }) {
    const paper = props.weeklies.find(weekly => weekly.emmaus && weekly.preview)!;
    const blatt = props.weeklies.find(weekly => weekly.emmaus && weekly.inzersdorf && weekly.neustift)!;
    return <Responsive><Section title="Pfarrzeitung" id="pfarrzeitung"><div className=" max-w-2xl my-16 space-y-12">
        <div className="flex flex-col md:flex-row items-start">
            <img src={getCockpitImageUrl(paper.preview.path)} className="w-48 mr-8 rounded"/>
            <div className="mt-4">
                <div className="text-3xl font-bold">
                    Der Emmausbote
                </div>
                <div className="text-lg my-3">
                    Ausführliche Berichte zum Pfarrleben, Diskussionen zur Weltkirche, Impulse zum Nachdenken und vieles
                    mehr finden Sie im Emmausboten.
                </div>
                <div className="flex space-x-2">
                    <Link href={getCockpitImageUrl(paper.emmaus)}>
                        <Button label="Aktuelle Ausgabe" className="bg-emmaus"/>
                    </Link>
                </div>
            </div>
        </div>
        <div className="flex flex-col md:flex-row items-start">
            <img src="/wochenblatt.webp" className="w-48 mr-8 rounded"/>
            <div className="mt-4">
                <div className="text-3xl font-bold">
                    Das Wochenblatt
                </div>
                <div className="text-lg my-3">
                    Ausführliche Berichte zum Pfarrleben, Diskussionen zur Weltkirche, Impulse zum Nachdenken und vieles
                    mehr finden Sie im Emmausboten.
                </div>
                <div className="flex space-x-2">
                    <Link href={getCockpitImageUrl(blatt.emmaus)}>
                        <Button label="Aktuelle Ausgabe" className="bg-emmaus"/>
                    </Link>
                </div>
            </div>
        </div>
    </div>
    </Section></Responsive>;
}