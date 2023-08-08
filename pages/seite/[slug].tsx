import React from 'react';
import {Collections} from "cockpit-sdk";
import {GetStaticPaths, GetStaticProps} from "next";
import Link from "next/link";
import {Article} from "../../components/Article";
import {site as siteDif} from "@/app/(shared)/Instance";
import {fetchEmmausSites} from "@/app/(shared)/Sites";

export default function HomePage(props: { site: Collections['site'] & {parent: Collections['site']}}) {
    return siteDif(<></>, <Article title={props.site.name}>
            {(props.site.children.length > 0 || props.site.parent) && <div className="mb-12 flex font-sans flex-wrap bg-emmaus/20 rounded-xl p-2 text-center">
                {!!props.site.parent && <Link href={`/seite/${props.site.parent.slug}`}>
                    <div
                        className="p-5 rounded-lg md:px-4 md:py-1 cursor-pointer hover:text-white hover:bg-emmaus">Zurück zu {props.site.parent.name}</div>
                </Link>}
                {props.site.children.map(child => <Link href={`/seite/${child.slug}`}>
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
    if (site === undefined) {
        return {
            notFound: true
        }
    }
    return {
        props: {site},
        revalidate: 10,
    }
}
