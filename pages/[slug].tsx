import React from 'react';
import Site from '../components/Site';
import {site, siteType, SiteType} from '../util/sites';
import {Collections} from "cockpit-sdk";
import {fetchEmmausSites} from "../util/fetchEmmausSites";
import {GetStaticPaths, GetStaticProps} from "next";
import {Article} from "../components/Article";

export default function HomePage(props: { site: Collections['site'] }) {
    return {
            [SiteType.ENI]: <>
            Test
            </>,
            [SiteType.EMMAUS]: <Article title={props.site.name}>
                {props.site.layout?.map(layoutEntity => ({
                    text: <div key={layoutEntity.component} dangerouslySetInnerHTML={{__html: layoutEntity.settings.text}}
                               className="custom-html mx-auto max-w-xl py-2"/>
                }[layoutEntity.component]))}
            </Article>
        }[siteType];
}

export const getStaticPaths: GetStaticPaths<{slug: string}> = async () => {
    const sites = await site(() => Promise.resolve([]), () => fetchEmmausSites())()
    return {
        paths: sites.filter(site => site.level === 0).map(site => ({params: {slug: site.slug}})),
        fallback: 'blocking'
    };
}

export const getStaticProps: GetStaticProps = async (context) => {
    const sites = await site(() => Promise.resolve([]), () => fetchEmmausSites())();
    const sitex = sites.find(site => site.slug === context.params!.slug);
    if(site == undefined){
        return {
            notFound: true
        }
    }
    console.log(context.params);
    return {
        props: { site: sitex },
        revalidate: 10,
    }
}