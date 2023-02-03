import Responsive from "../components/Responsive";
import {Section} from "../components/Section";
import Site from '../components/Site';
import TopBar from '../components/TopBar';
import {getCachedEvents, GetEventPermission} from "../util/calendar-events";
import {EventsObject} from '../util/calendar-types';
import {fetchArticles} from "../util/fetchArticles";
import {fetchEmmausSites} from "../util/fetchEmmausSites";
import {fetchInstagramFeed} from "../util/fetchInstagram";
import {fetchEmmausbote} from "../util/fetchWeeklies";
import {site} from '../util/sites';
import {getLiturgyData, Liturgy} from "./api/liturgy";
import {Instagram, InstagramFeedItem} from "../components/Instagram";
import {Collections} from "cockpit-sdk";
import {ChristmasDisplay} from "../components/ChristmasDisplay";
import {EniSections} from "../components/EniSections";
import {EmmausBranding} from "../components/EmmausBranding";
import Articles from "../components/Articles";
import {ComingUp} from "../components/calendar/ComingUp";
import {EmmausSections} from "../components/EmmausSections";
import {News} from "../components/News";

export default function HomePage(
    props: {
        eventsObject: EventsObject,
        instagram: InstagramFeedItem[],
        articles: any[],
        liturgyEvents: (Liturgy & { date: string })[],
        emmausbote: Collections['Emmausbote'][],
        sites: Collections['site'][],
    }
) {
    return site(() => <>
            <Site
                responsive={false} navbar={false}
                description="Drei Pfarren im Wiener Dekanat 23"
                keywords={["Katholisch", "Pfarre", "Glaube", "Gemeinschaft"]}>
                <TopBar/>
                    <Responsive>
                        <News eventsObject={props.eventsObject} liturgyEvents={props.liturgyEvents}/>
                    </Responsive>
                <ChristmasDisplay eventsObject={props.eventsObject}/>
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
                <EmmausBranding eventsObject={props.eventsObject}/>
            </div>
            <div className="relative z-10 bg-white">
                <Articles items={props.articles} sites={props.sites}/>
                <ComingUp eventsObject={props.eventsObject}/>
                <EmmausSections emmausbote={props.emmausbote}/>
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
    const liturgy = await site(async () => {
        const liturgy = await getLiturgyData();
        const now = new Date().getTime();
        const events = Object.entries(liturgy)
            .flatMap(([date, liturgies]) => liturgies.map(liturgy => ({rank: liturgy.rank, name: liturgy.name, date})))
            .filter(({
                         date,
                         rank
                     }) => new Date(date).getTime() + 1000 * 3600 * 24 > now && (rank === "F" || rank === "H"))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return events;
    }, () => Promise.resolve({}))();
    return {
        props: {
            instagram: await fetchInstagramFeed(),
            eventsObject: await getCachedEvents({permission: GetEventPermission.PUBLIC}),
            articles: await site(() => Promise.resolve({}), () => fetchArticles())(),
            sites: await site(() => Promise.resolve({}), () => fetchEmmausSites())(),
            emmausbote: await site(() => Promise.resolve({}), () => fetchEmmausbote())(),
            liturgyEvents: liturgy,
        },
        revalidate: 60 * 5,
    }
}