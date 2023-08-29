import React from 'react';
import Link from "next/link";
import {Article} from "../../../components/Article";
import {site as siteDif} from "../../(shared)/Instance";
import {fetchEmmausSites} from "../../(shared)/Sites";
import {notFound} from "next/navigation";
import {Links} from "../../(shared)/Links";

export default async function SitePage({params}: { params: { slug: string } }) {
    const sites = await siteDif(() => notFound(), () => fetchEmmausSites())();
    const site: any = sites.find(site => site.slug === params.slug);
    if (site === undefined) {
        notFound()
    }
    return siteDif(<></>, <Article title={site.name}>
            {(site.children.length > 0 || site.parent) && <div className="mb-12 flex font-sans flex-wrap bg-emmaus/20 rounded-xl p-2 text-center">
                {!!site.parent && <Link href={Links.Seite(site.parent.slug)}>
                    <div
                        className="p-5 rounded-lg md:px-4 md:py-1 cursor-pointer hover:text-white hover:bg-emmaus">Zurück zu {site.parent.name}</div>
                </Link>}
                {site.children.map((child: any) => <Link href={Links.Seite(site.slug)}>
                    <div
                        className="p-5 rounded-lg md:px-4 md:py-1 cursor-pointer hover:text-white hover:bg-emmaus">{child.name}</div>
                </Link>)}
            </div>}
            {site.layout?.map((layoutEntity: any) => ({
                text: <div key={layoutEntity.component} dangerouslySetInnerHTML={{__html: layoutEntity.settings.text as string}}
                           className="custom-html mx-auto max-w-xl py-2"/>
            }[layoutEntity.component as 'text']))}
        </Article>);
}
