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
import {CalendarEvent, EventsObject, getCachedEvents} from "../util/calendar-events";

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
                <EmmausBranding/>
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