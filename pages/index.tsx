import Responsive from "../components/Responsive";
import {Section} from "../components/Section";
import Site from '../components/Site';
import TopBar from '../components/TopBar';
import {getCachedEvents, GetEventPermission} from "../util/calendar-events";
import {CalendarGroup, CalendarTag, EventsObject} from '../util/calendar-types';
import {fetchArticles} from "../util/fetchArticles";
import {fetchEmmausSites} from "../util/fetchEmmausSites";
import {fetchInstagramFeed} from "../util/fetchInstagram";
import {fetchEmmausbote} from "../util/fetchWeeklies";
import {site} from '../util/sites';
import {getLiturgyData, Liturgy} from "./api/liturgy";
import {EventDateText, EventTime} from "../components/calendar/Event";
import {getCalendarInfo} from "../util/calendar-info";
import {Instagram, InstagramFeedItem} from "../components/Instagram";
import {Collections} from "cockpit-sdk";
import {EniBranding} from "../components/EniBranding";
import {ChristmasDisplay} from "../components/ChristmasDisplay";
import {Personal} from "../components/Personal";
import {EniSections} from "../components/EniSections";
import {EmmausBranding} from "../components/EmmausBranding";
import Articles from "../components/Articles";
import {ComingUp} from "../components/calendar/ComingUp";
import {EmmausSections} from "../components/EmmausSections";
import {PartyPopper, Scroll} from "lucide-react";

function News(props: { eventsObject: EventsObject, liturgyEvents: (Liturgy & { date: string })[] }) {

    const now = new Date().getTime();
    const announcements = [
        ...props.eventsObject.events
            .filter(event => event.tags.includes(CalendarTag.announcement))
            .map(event => ({...event, liturgy: false})),
        //...props.liturgyEvents.map(event => ({...event, summary: event.name, liturgy: true}))
    ]
        .map(event => ({
            ...event,
            points: (event.liturgy ? 0 : -10000) + Math.pow((new Date(event.date).getTime() - now) / 10000000, 2)
        }))
        .sort((a, b) => a.points - b.points);
    const announcement = announcements[0];

    return <div className="flex flex-col items-start gap-2 bg-black/[4%] p-12 rounded-xl">
            <div className="text-lg flex gap-8 uppercase">
                {announcement.liturgy ? <PartyPopper /> : <Scroll />}
                <div>{announcement.liturgy ? "Kirchliches Fest" : "Ankündigung"}</div>
                <EventDateText date={new Date(announcement.date)}/>
                <div>{'start' in announcement && <EventTime date={new Date(announcement.start.dateTime)}/>}</div>
            </div>
            <div className="text-5xl font-bold mb-4">
                {/*{new Date(announcement.date).toLocaleDateString("de").split(".").slice(0, 2).join(".")}.:*/}
                {announcement.summary}
            </div>
            {'calendar' in announcement && <div
                className={`text-lg font-bold px-4 rounded-full ${getCalendarInfo(announcement.calendar).className}`}>
                {getCalendarInfo(announcement.calendar).fullName}
            </div>}
            {announcement.liturgy && <div className={` flex flex-col gap-1`}>
                {props.eventsObject.events
                    .filter(event =>
                        event.date === announcement.date &&
                        (event.groups.includes(CalendarGroup.Messe) || event.groups.includes(CalendarGroup.Gottesdienst)))
                    .map(event => <div className="flex gap-3 items-center">
                        <div
                            className={`font-bold px-4 rounded-full ${getCalendarInfo(event.calendar).className}`}>
                            {getCalendarInfo(event.calendar).tagName}
                        </div>
                        <div className="text-lg font-bold">
                            <EventTime date={new Date(event.start.dateTime)}/>
                        </div>
                        <div className="text-lg font-bold">
                            {event.summary}
                        </div>
                    </div>)
                }
            </div>}
        </div>;
}


function ShortInstagram(props: { items: InstagramFeedItem[] }) {
    return <div className="flex gap-4 my-4 -mx-12">
        {props.items
            .slice(0,4)
            .map(item => <div className="w-64 aspect-square bg-center bg-contain rounded-xl" style={{backgroundImage: `url(${item.media_url})`}}></div>)}
    </div>;
}

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
                <EniBranding/>
                <Responsive>
                    <News eventsObject={props.eventsObject} liturgyEvents={props.liturgyEvents}/>
                    <ShortInstagram items={props.instagram}/>
                </Responsive>
                <ChristmasDisplay eventsObject={props.eventsObject}/>
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
            .filter(({date, rank}) => new Date(date).getTime() > now && (rank === "F" || rank === "H"))
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