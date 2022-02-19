import {Section} from './Section';
import Button from './Button';
import Link from 'next/link';
import React from 'react';
import {Info} from './Info';

export function Sections() {
    return <Section title="Weiteres">
        <div className="grid md:grid-cols-2 gap-4">
            <Info title="Wochenmitteilungen" image="./info-01.svg">
                <div className="mb-4">
                    Gottesdienste, Veranstaltungen und Ankündigungen jede Woche neu in Ihr Postfach.
                    Schicken Sie eine Mail mit der gewünschten Pfarre an die Kanzlei und bleiben Sie up to date.
                </div>
                <a href="mailto://kanzlei@eni.wien"><Button label="Mail schicken"/></a>
            </Info>
            <Info title="Pfarrzeitung" image="./info-02.svg">
                <div className="mb-4">
                    Ausführliche Berichte zum Pfarrleben, Diskussionen zur Weltkirche, Impulse zum Nachdenken
                    und vieles mehr
                    finden Sie in den Pfarrzeitungen der Pfarren.
                </div>
                <Link href="/pfarrzeitung"><a><Button label="Pfarrzeitungen ansehen"/></a></Link>
            </Info>
        </div>
    </Section>;
}