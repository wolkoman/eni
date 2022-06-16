import React from 'react';
import Articles from '../components/Articles';
import Site from '../components/Site';
import {Instagram, InstagramFeedItem} from '../components/Instagram';
import {Parishes} from '../components/Parishes';
import {TopBranding} from '../components/TopBranding';
import Responsive from '../components/Responsive';
import {ComingUp} from '../components/calendar/ComingUp';
import {Sections} from '../components/Sections';
import {site, siteType, SiteType} from '../util/sites';
import Navbar from '../components/Navbar';
import {fetchInstagramFeed} from "../util/fetchInstagram";
import {fetchArticles} from "../util/fetchArticles";
import {fetchWeeklies} from "../util/fetchWeeklies";
import {Collections} from "cockpit-sdk";
import {Section} from "../components/Section";
import Link from "next/link";
import {fetchEmmausSites} from "../util/fetchEmmausSites";
import {GetStaticPropsContext} from "next";
import {EmmausSections} from "../components/EmmausSections";


function Navigation(props: { sites: Collections["site"][] }) {
    return <div className="sticky z-20 top-0 px-8 bg-emmaus/90 text-white text-lg hidden md:flex justify-between">
        <div className="flex justify-between p-4 font-bold">
            Pfarre Emmaus am Wienerberg
        </div>
        <div className="flex flex-wrap">
        {props.sites.filter(site => site.level === 0).map(site => <Link href={`/${site.slug}`} key={site.slug}>
            <div className="p-4 cursor-pointer">
                {site.name}
            </div>
        </Link>)}
        </div>
    </div>;
}

export default function HomePage(props: { instagram: InstagramFeedItem[], articles: any[], weeklies: Collections['weekly'][], sites: Collections['site'][] }) {
    return <Site responsive={false} navbar={false}>
        {{
            [SiteType.ENI]: () => <>
                <Navbar/>
                <Parishes/>
                <ComingUp/>
                <Instagram items={props.instagram}/>
                <Sections weeklies={props.weeklies}/>
            </>,
            [SiteType.EMMAUS]: () => <>
                <Navbar/>
                <TopBranding/>
                <Navigation sites={props.sites}/>
                <Articles items={props.articles}/>
                <ComingUp/>
                <EmmausSections weeklies={props.weeklies}/>
                <Instagram items={props.instagram}/>
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