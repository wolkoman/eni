import Link from 'next/link';
import * as React from 'react';
import Button from './Button';
import {cockpit} from '../util/cockpit-sdk';
import {Collections} from 'cockpit-sdk';
import {Section} from './Section';
import Responsive from "./Responsive";

export function getCockpitImageUrl(url: string) {
    if(url.startsWith('https')) return url;
    if(url.startsWith('/storage')) return `${cockpit.host}${url}`;
    if(url.startsWith('storage')) return `${cockpit.host}/${url}`;
    return `${cockpit.host}/storage/uploads/${url}`
}

export function getArticleLink(article?: Collections['article']) {
    return article ? (article.external_url || `/artikel/${article._id}`) : '';
}

function ArticleCard(props: { article?: Collections['article'] }) {
    return <Link href={getArticleLink(props.article)}>
        <div className={`flex flex-row cursor-pointer ${!props.article && 'shimmer'} bg-emmaus/20 hover:bg-emmaus/10 rounded`}>
            <div className="w-32 mr-4 aspect-square flex-shrink-0 rounded m-3"
                 style={!props.article ? {} : {
                     backgroundImage: `url(${getCockpitImageUrl(props.article.preview_image.path)})`,
                     backgroundSize: 'cover',
                     backgroundPosition: '50% 50%'
                 }}/>
            <div className="flex flex-col justify-center overflow-hidden">
                <div className="uppercase opacity-80 text-sm">{props.article?.resort}</div>
                <div className="line-clamp-3 font-semibold text-xl">{props.article?.title}</div>
            </div>
        </div>
    </Link>;
}

export default function Articles(props: { items: Collections['article'][], sites: Collections['site'][] }) {
    return <div className="my-20"><Responsive><Section id="aktuelles">
        <div className="flex flex-col my-20">
            <div>
                <div className="text-2xl md:text-5xl mb-20 flex flex-col justify-center text-center max-w-2xl mx-auto">
                    „Am gleichen Tag waren zwei von den Jüngern auf dem Weg in ein Dorf namens Emmaus..“
                    <div className="text-lg font-bold text-emmaus">Lukas, 24:13</div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 my-6">
                    <div><ArticleCard article={props.items[0]}/></div>
                    <div><ArticleCard article={props.items[1]}/></div>
                    <div>
                        <ArticleCard article={props.items[2]}/>
                        <div className="p-4 mt-4 rounded bg-emmaus/20 hover:bg-emmaus/10 font-bold text-lg cursor-pointer">Alle Beiträge</div>
                    </div>
                </div>
            </div>

            <div>
                <div className="grid md:grid-cols-3 gap-4 my-6">
                    {props.sites.filter(site => site.level === 0).map(site =>
                        <Link href={"/"+site.slug}>
                        <div className="p-4 py-6 rounded border border-emmaus/20 hover:bg-emmaus/5 font-bold text-lg cursor-pointer text-center">{site.name}</div>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    </Section>
    </Responsive></div>;
}