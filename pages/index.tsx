import React from 'react';
import Articles from '../components/Articles';
import Site from '../components/Site';
import {Instagram, InstagramFeedItem} from '../components/Instagram';
import {EniBranding} from '../components/EniBranding';
import {EmmausBranding} from '../components/EmmausBranding';
import {ComingUp} from '../components/calendar/ComingUp';
import {EniSections} from '../components/EniSections';
import {site} from '../util/sites';
import TopBar from '../components/TopBar';
import {fetchInstagramFeed} from "../util/fetchInstagram";
import {fetchArticles} from "../util/fetchArticles";
import {fetchWeeklies} from "../util/fetchWeeklies";
import {Collections} from "cockpit-sdk";
import {fetchEmmausSites} from "../util/fetchEmmausSites";
import {EmmausSections} from "../components/EmmausSections";
import {EmmausNavigation} from "../components/EmmausNavigation";
import {Section} from "../components/Section";
import Responsive from "../components/Responsive";
import {getCachedEvents} from "../util/calendar-events";
import {EventsObject} from "../util/calendar-types";
import {SectionHeader} from "../components/SectionHeader";
import Link from "next/link";
import {CalendarName, getCalendarInfo} from "../util/calendar-info";

function Personal() {
    return <>
        <Responsive>
            <SectionHeader id="personal">Priester</SectionHeader>
            <div className="grid grid-cols-2 lg:flex gap-10 mb-24">
                <Person img="/personal/zvonko.png" name="Dr. Zvonko Brezovski" role="Pfarrer" mail="pfarrer"/>
                <Person img="/personal/marcin.png" name="Marcin Wojciech" role="Pfarrvikar" mail="pfarrvikar"/>
                <Person img="/personal/gil.png" name="Gil Vicente Thomas" role="Aushilfskaplan" mail="kaplan.e"/>
                <Person img="/personal/david.png" name="David Campos" role="Aushilfskaplan" mail="kaplan.in"/>
            </div>
        </Responsive>
    </>
}
function Person(props: { img: string, name: string, role: string, mail: string }) {
    return <div className="flex flex-col items-center text-center">
        <div className="rounded-full aspect-square w-36 bg-black/20 relative">
            <div style={{backgroundImage: `url(${props.img})`}}  className="absolute inset-0 rounded-full scale-95  bg-cover"/>
        </div>
        <div className="text-xl font-bold mt-4">{props.name}</div>
        <div className="italic">{props.role}</div>
        <div className="underline ">{props.mail}@eni.wien</div>
    </div>
}

export default function HomePage(
    props: {
        eventsObject: EventsObject,
        instagram: InstagramFeedItem[],
        articles: any[],
        weeklies: Collections['weekly'][],
        sites: Collections['site'][]
    }
) {
    return site(() => <>
            <Site
                responsive={false} navbar={false}
                description="Drei Pfarren im Wiener Dekanat 23"
                keywords={["Katholisch", "Pfarre", "Glaube", "Gemeinschaft"]}>
                <TopBar/>
                <EniBranding/>
                <ComingUp eventsObject={props.eventsObject}/>
                <Personal/>
                <Instagram items={props.instagram}/>
                <EniSections/>
            </Site>
        </>,
        () => <Site
            responsive={false} navbar={false}
            description="Eine katholische Pfarre im Wiener Dekanat 23"
            keywords={["Katholisch", "Pfarre", "Glaube", "Gemeinschaft"]}>
            <div className="md:sticky inset-0 w-full">
                <TopBar/>
                <EmmausBranding eventsObject={props.eventsObject}/>
            </div>
            <div className="relative z-10 bg-white">
                <EmmausNavigation/>
                <Articles items={props.articles} sites={props.sites}/>
                <ComingUp eventsObject={props.eventsObject}/>
                <EmmausSections weeklies={props.weeklies}/>
                <Instagram items={props.instagram}/>
                <Responsive>
                    <Section title="Kontakt" id="kontakt">
                        <div className="text-lg">
                            Röm.-kath. Pfarre Emmaus am Wienerberg<br/>
                            Tesarekplatz 2, 1100 Wien<br/>
                            Telefon: +43 1 616 34 00<br/>
                            IBAN: AT97 12000 50324795601<br/>
                            BIC: BKAUATWW
                        </div>
                    </Section>
                </Responsive>
            </div>
        </Site>)();
}

export async function getStaticProps() {
    return {
        props: {
            instagram: await fetchInstagramFeed(),
            eventsObject: await getCachedEvents(false),
            articles: await site(() => Promise.resolve({}), () => fetchArticles())(),
            sites: await site(() => Promise.resolve({}), () => fetchEmmausSites())(),
            weeklies: await site(() => Promise.resolve({}), () => fetchWeeklies())(),
        },
        revalidate: 60,
    }
}