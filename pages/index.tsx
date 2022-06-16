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
                <div className="px-8 bg-emmaus text-white text-lg hidden md:flex">
                    {props.sites.filter(site => site.level === 0).map(site => <Link href={`/${site.slug}`} key={site.slug}><div className="px-8 py-4 cursor-pointer">
                        {site.name}
                    </div></Link>)}
                </div>
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