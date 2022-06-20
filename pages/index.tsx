import React from 'react';
import Articles from '../components/Articles';
import Site from '../components/Site';
import {Instagram, InstagramFeedItem} from '../components/Instagram';
import {Parishes} from '../components/Parishes';
import {TopBranding} from '../components/TopBranding';
import {ComingUp} from '../components/calendar/ComingUp';
import {Sections} from '../components/Sections';
import {site, siteType, SiteType} from '../util/sites';
import TopBar from '../components/TopBar';
import {fetchInstagramFeed} from "../util/fetchInstagram";
import {fetchArticles} from "../util/fetchArticles";
import {fetchWeeklies} from "../util/fetchWeeklies";
import {Collections} from "cockpit-sdk";
import {fetchEmmausSites} from "../util/fetchEmmausSites";
import {GetStaticPropsContext} from "next";
import {EmmausSections} from "../components/EmmausSections";
import {Navigation} from "../components/Navigation";
import {Section} from "../components/Section";
import Responsive from "../components/Responsive";


export default function HomePage(props: { instagram: InstagramFeedItem[], articles: any[], weeklies: Collections['weekly'][], sites: Collections['site'][] }) {
    return <Site responsive={false} navbar={false}>
        {{
            [SiteType.ENI]: () => <>
                <TopBar/>
                <Parishes/>
                <ComingUp/>
                <Instagram items={props.instagram}/>
                <Sections weeklies={props.weeklies}/>
            </>,
            [SiteType.EMMAUS]: () => <>
                <TopBar/>
                <TopBranding/>
                <Navigation/>
                <Articles items={props.articles} sites={props.sites}/>
                <ComingUp/>
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
            </>
        }[siteType]()}
    </Site>
}

export async function getStaticProps(context: GetStaticPropsContext) {
    return {
        props: {
            instagram: await fetchInstagramFeed(),
            articles: await site(() => Promise.resolve({}), () => fetchArticles())(),
            sites: await site(() => Promise.resolve({}), () => fetchEmmausSites())(),
            weeklies: await fetchWeeklies()
        },
        revalidate: 100,
    }
}