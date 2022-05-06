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

function EmmausSections() {
    return <Responsive><Section title="Gruppen">
        <div className="flex flex-col items-center space-y-8">
            <EmmausSection picture={"/Ill_Child.svg"} title="Kinder"/>
            <EmmausSection picture={"/Ill_Bird.svg"} title="Firmung" flipped={true}/>
            <EmmausSection picture={"/Ill_Music.svg"} title="Chor"/>
            <EmmausSection picture={"/Ill_Church.svg"} title="Pfarre" flipped={true}/>
        </div>
    </Section></Responsive>;
}

function EmmausSection(props: { picture: string, title: string, flipped?: boolean }) {
    return <div className={`flex ${props.flipped && 'flex-row-reverse'} space-x-4 items-center max-w-2xl`}>
        <div className="w-52">
            <img src={props.picture} className=""/>
        </div>
        <div className="">
            <div className="text-4xl font-semibold">{props.title}</div>
            <div className="text-lg  my-4">{props.title}</div>
        </div>
    </div>;
}

export default function HomePage(props: { instagram: InstagramFeedItem[], articles: any[], weeklies: Collections['weekly'][], sites: Collections['site'][] }) {
    return <Site responsive={false} navbar={false}>
        {{
            [SiteType.ENI]: <>
                <Navbar/>
                <Parishes/>
                <ComingUp/>
                <Instagram items={props.instagram}/>
                <Sections weeklies={props.weeklies}/>
                <Responsive>
                    <div className="flex justify-end my-16">
                        <Link href="/artikel/627003446365316d55000388">
                            <div className="underline hover:no-underline cursor-pointer w-44 rotate-[-10deg]">
                                Hat diese Seite nicht anders ausgeschaut?
                            </div></Link>
                    </div>
                </Responsive>
            </>,
            [SiteType.EMMAUS]: <>
                <Navbar/>
                <TopBranding/>
                <div className="flex bg-primary1 text-white text-lg">
                    {props.sites.filter(site => site.level === 0).map(site => <Link href={`/${site.slug}`}><div className="px-8 py-4 cursor-pointer">
                        {site.name}
                    </div></Link>)}
                </div>
                <Articles items={props.articles}/>
                <ComingUp/>
                <Instagram items={props.instagram}/>
                <EmmausSections/>
            </>
        }[siteType]}
    </Site>
}

export async function getStaticProps() {

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