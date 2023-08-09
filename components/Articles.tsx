import Link from 'next/link';
import * as React from 'react';
import {cockpit} from '@/util/cockpit-sdk';
import {Collections} from 'cockpit-sdk';
import Responsive from "./Responsive";
import {SectionHeader} from "./SectionHeader";

export function getCockpitResourceUrl(url: string) {
    if (url.startsWith('https')) return url;
    if (url.startsWith('/storage')) return `${cockpit.host}${url}`;
    if (url.startsWith('storage')) return `${cockpit.host}/${url}`;
    return `${cockpit.host}/storage/uploads/${url}`
}

export function getArticleLink(article?: Collections['article']) {
    return article ? (article.external_url || `/artikel/${article._id}`) : '';
}

function ArticleCard(props: { article?: Collections['article'] }) {
    return <Link href={getArticleLink(props.article)}>
        <div
            className={`flex flex-row cursor-pointer bg-emmaus/20 hover:bg-emmaus/5 rounded-lg p-2 gap-3`}>
            <div className="w-32 aspect-square flex-shrink-0 rounded-lg"
                 style={!props.article ? {} : {
                     backgroundImage: `url(${getCockpitResourceUrl(props.article.preview_image.path)})`,
                     backgroundSize: 'cover',
                     backgroundPosition: '50% 50%'
                 }}/>
            <div className="flex flex-col justify-center overflow-hidden">
                <div className="line-clamp-3 font-semibold text-lg">{props.article?.title}</div>
            </div>
        </div>
    </Link>;
}

export default function Articles(props: { items: Collections['article'][], sites: Collections['site'][] }) {
    return <div className="flex flex-col">
            <div className="bg-emmauss/30 py-6"><Responsive>
                <SectionHeader>Artikel</SectionHeader>
                <div className="grid md:grid-cols-3 gap-4">
                    <div><ArticleCard article={props.items[0]}/></div>
                    <div><ArticleCard article={props.items[1]}/></div>
                    <div>
                        <ArticleCard article={props.items[2]}/>
                        <Link href="/app/page.tsx">
                        <div
                            className="p-4 mt-4 rounded bg-emmaus/20 hover:bg-emmaus/10 font-bold text-lg cursor-pointer">Alle
                            Beiträge
                        </div>
                        </Link>
                    </div>
                </div></Responsive>
            </div>

            <div><Responsive>
                <SectionHeader>Über uns</SectionHeader>
                <div className="grid md:grid-cols-3 gap-4 my-6">
                    {props.sites.filter(site => site.level === 0).map(site =>
                        <Link href={"/seite/" + site.slug}>
                            <div
                                className="p-4 py-6 rounded border border-emmaus/20 hover:bg-emmaus/5 font-bold text-lg cursor-pointer text-center">{site.name}</div>
                        </Link>
                    )}
                </div></Responsive>
            </div>
    </div>;
}
