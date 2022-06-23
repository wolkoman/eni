import {Section} from './Section';
import Link from 'next/link';
import React from 'react';
import Responsive from "./Responsive";
import {Collections} from "cockpit-sdk";
import {getCalendarInfo} from "../util/calendar-info";
import {getCockpitImageUrl} from "./Articles";

export function EmmausSections(props: { weeklies: Collections['weekly'][] }) {
    const paper = props.weeklies.find(weekly => weekly.emmaus && weekly.preview)!;
    return <Responsive><Section title="Pfarrzeitung">
        <div className="flex flex-col md:flex-row items-start max-w-2xl mx-auto my-24">
            <img src={getCockpitImageUrl(paper.preview.path)} className="w-64 mr-8 rounded outline outline-4 outline-emmaus/50"/>
            <div className="mt-4">
                <div className="text-5xl">
                    Der Emmausbote
                </div>
                <div className="text-lg my-3">
                    Ausführliche Berichte zum Pfarrleben, Diskussionen zur Weltkirche, Impulse zum Nachdenken und vieles mehr finden Sie im Emmausboten.
                </div>
                <div className="flex space-x-2">
                    {['emmaus'].map(id => getCalendarInfo(id as any)).map(info =>
                        <Link href={getCockpitImageUrl(paper.emmaus)} key={info.id}>
                            <div className={`${info.className} px-3 py-1 my-1 text-lg rounded cursor-pointer`}>
                                Aktuelle Ausgabe
                            </div>
                        </Link>
                    )}
                </div>
        </div>
    </div>
    </Section></Responsive>;
}