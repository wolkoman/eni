import React from 'react';
import {site as siteDif, siteType, SiteType} from '../util/sites';
import {Collections} from "cockpit-sdk";
import {fetchEmmausSites} from "../util/fetchEmmausSites";
import {GetStaticPaths, GetStaticProps} from "next";
import {Article} from "../components/Article";
import Link from "next/link";
import {Icon} from "../components/calendar/ComingUp";

export default function HomePage(props: { site: Collections['site'] & {parent: Collections['site']}}) {
    return siteDif(<></>, <Article title={props.site.name}>
            {(props.site.children.length > 0 || props.site.parent) && <div className="mb-12 flex font-sans flex-wrap bg-emmaus/20 rounded-xl p-2 text-center">
                {!!props.site.parent && <Link href={`/${props.site.parent.slug}`}>
                    <div
                        className="p-5 rounded-lg md:px-4 md:py-1 cursor-pointer hover:text-white hover:bg-emmaus">Zurück zu {props.site.parent.name}</div>
                </Link>}
                {props.site.children.map(child => <Link href={`/${child.slug}`}>
                    <div
                        className="p-5 rounded-lg md:px-4 md:py-1 cursor-pointer hover:text-white hover:bg-emmaus">{child.name}</div>
                </Link>)}
            </div>}
            {props.site.layout?.map(layoutEntity => ({
                text: <div key={layoutEntity.component} dangerouslySetInnerHTML={{__html: layoutEntity.settings.text}}
                           className="custom-html mx-auto max-w-xl py-2"/>
            }[layoutEntity.component]))}
        </Article>);
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    const sites = await siteDif(() => Promise.resolve([]), () => fetchEmmausSites())()
    return {
        paths: sites.filter(site => site.level === 0).map(site => ({params: {slug: site.slug}})),
        fallback: 'blocking'
    };
}

export const getStaticProps: GetStaticProps = async (context) => {
    const sites = await siteDif(() => Promise.resolve([]), () => fetchEmmausSites())();
    const site = sites.find(site => site.slug === context.params!.slug);
    if (site == undefined) {
        return {
            notFound: true
        }
    }
    return {
        props: {site},
        revalidate: 10,
    }
}