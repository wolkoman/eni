import { Collections } from "cockpit-sdk";
import Articles from '../components/Articles';
import { ComingUp } from '../components/calendar/ComingUp';
import { ChristmasDisplay } from "../components/ChristmasDisplay";
import { EmmausBranding } from '../components/EmmausBranding';
import { EmmausNavigation } from "../components/EmmausNavigation";
import { EmmausSections } from "../components/EmmausSections";
import { EniBranding } from '../components/EniBranding';
import { EniSections } from '../components/EniSections';
import { Instagram, InstagramFeedItem } from '../components/Instagram';
import { Personal } from "../components/Personal";
import Responsive from "../components/Responsive";
import { Section } from "../components/Section";
import Site from '../components/Site';
import TopBar from '../components/TopBar';
import { getCachedEvents, GetEventPermission } from "../util/calendar-events";
import { EventsObject } from '../util/calendar-types';
import { fetchArticles } from "../util/fetchArticles";
import { fetchEmmausSites } from "../util/fetchEmmausSites";
import { fetchInstagramFeed } from "../util/fetchInstagram";
import { fetchEmmausbote, fetchWeeklies } from "../util/fetchWeeklies";
import { isBeforeChristmas, isChristmas } from "../util/isChristmas";
import { site } from '../util/sites';

export default function HomePage(
    props: {
        eventsObject: EventsObject,
        instagram: InstagramFeedItem[],
        articles: any[],
        weeklies: Collections['weekly'][],
        emmausbote: Collections['Emmausbote'][],
        sites: Collections['site'][]
    }
) {
    return site(() => <>
        <Site
            responsive={false} navbar={false}
            description="Drei Pfarren im Wiener Dekanat 23"
            keywords={["Katholisch", "Pfarre", "Glaube", "Gemeinschaft"]}>
            <TopBar />
            <EniBranding />
            {isBeforeChristmas() && <ChristmasDisplay eventsObject={props.eventsObject} /> }
            <ComingUp eventsObject={props.eventsObject} />
            <Personal />
            <Instagram items={props.instagram} />
            <EniSections />
        </Site>
    </>,
        () => <Site
            responsive={false} navbar={false}
            description="Eine katholische Pfarre im Wiener Dekanat 23"
            keywords={["Katholisch", "Pfarre", "Glaube", "Gemeinschaft"]}>
            <div className="md:sticky inset-0 w-full">
                <TopBar />
                <EmmausBranding eventsObject={props.eventsObject} />
            </div>
            <div className="relative z-10 bg-white">
                <EmmausNavigation />
                <Articles items={props.articles} sites={props.sites} />
                <ComingUp eventsObject={props.eventsObject} />
                <EmmausSections weeklies={props.weeklies} emmausbote={props.emmausbote} />
                <Instagram items={props.instagram} />
                <Responsive>
                    <Section title="Kontakt" id="kontakt">
                        <div className="text-lg">
                            Röm.-kath. Pfarre Emmaus am Wienerberg<br />
                            Tesarekplatz 2, 1100 Wien<br />
                            Telefon: +43 1 616 34 00<br />
                            IBAN: AT97 12000 50324795601<br />
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
            eventsObject: await getCachedEvents({ permission: GetEventPermission.PUBLIC }),
            articles: await site(() => Promise.resolve({}), () => fetchArticles())(),
            sites: await site(() => Promise.resolve({}), () => fetchEmmausSites())(),
            weeklies: await site(() => Promise.resolve({}), () => fetchWeeklies())(),
            emmausbote: await site(() => Promise.resolve({}), () => fetchEmmausbote())(),
        },
        revalidate: 60,
    }
}