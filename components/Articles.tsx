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

function BigArticle(props: { article?: Collections['article'] }) {
    return <div
        className={`flex flex-col md:flex-row items-stretch w-full ${!props.article && 'shimmer'}`}
        data-testid="articles">

        <div className="w-64 md:w-80 aspect-square flex-shrink-0 rounded-lg border-white outline outline-4 outline-emmaus/50"
             style={!props.article ? {} : {
                 backgroundImage: `url(${getCockpitImageUrl(props.article.preview_image.path)})`,
                 backgroundSize: 'cover',
                 backgroundPosition: '50% 50%'
             }}/>
        <div className="p-4 md:p-8 flex flex-col">
            {!props.article || <>
                <div className="uppercase opacity-80 font-semibold my-1 text-lg">{props.article?.resort}</div>
                <Link href={getArticleLink(props.article)}>
                    <div className="text-3xl font-bold md:font-semibold md:text-5xl cursor-pointer line-clamp-2">
                        {props.article.title}
                    </div>
                </Link>
                <div className="text-lg leading-7 mt-2 line-clamp-4">
                    {props.article.content}
                </div>
                <div className="flex justify-end">
                    <Link href={getArticleLink(props.article)}><a>
                        <Button label="Weiterlesen"/></a>
                    </Link>
                </div>
            </>}
        </div>

    </div>;
}

function SmallArticleCard(props: { article?: Collections['article'] }) {
    return <Link href={getArticleLink(props.article)}>
        <div
            className={`flex flex-row p-4 cursor-pointer ${!props.article && 'shimmer'}`}>

            <div className="w-32 mr-4 aspect-square flex-shrink-0 rounded-lg  outline outline-4 outline-emmaus/50"
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

function AllArticlesCard() {
    return <Link href="/artikel">
        <div className={`flex flex-row items-center m-4 p-2 cursor-pointer outline outline-4 outline-emmaus/50 rounded`}>
                <div className="line-clamp-3 font-semibold text-xl">Alle Beiträge</div>
        </div>
    </Link>;
}


export default function Articles(props: { items: Collections['article'][], sites: Collections['site'][] }) {

    const Button = (props: { slug: string, name: string }) => <Link href={`/${props.slug}`}>
        <div
            className=" p-4 rounded-lg border-4 border-emmaus/50 font-bold text-lg cursor-pointer">{props.name}</div>
    </Link>

    return <div className="my-20"><Responsive><Section title="Aktuelles" id="aktuelles">
        <div className="flex flex-col">
            <BigArticle article={props.items[0]}/>
            <div className="grid md:grid-cols-2 mt-6">
                <SmallArticleCard article={props.items[1]}/>
                <SmallArticleCard article={props.items[2]}/>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 mt-6 gap-2">
                {props.sites.filter(site => site.level === 0).map(site => <Button key={site._id} name={site.name} slug={site.slug}/>)}
                <Button slug={'/artikel'} name="Alle Beiträge"/>
            </div>
        </div>
    </Section>
    </Responsive></div>;
}