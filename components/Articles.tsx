import Link from 'next/link';
import * as React from 'react';
import Button from './Button';
import {cockpit} from '../util/cockpit-sdk';
import {Collections} from 'cockpit-sdk';
import {SectionHeader} from './SectionHeader';
import {useArticleStore} from '../util/use-article-store';
import {Section} from './Section';

export function getArticlePreviewImageUrl(article: Collections['article']) {
    const url = article.preview_image.path;
    return url.startsWith('https') ? url : `${cockpit.host}${url}`;
}

export function getArticleLink(article?: Collections['article']) {
    return article ? (article.external_url || `/artikel/${article._id}`) : '';
}

function BigArticle(props: { article?: Collections['article'] }) {
    return <div
        className={`flex flex-col md:flex-row bg-white shadow rounded-xl overflow-hidden items-stretch w-full h-[480px] md:h-[360px] ${!props.article && 'shimmer'}`}
        data-testid="articles">

        <div className="md:w-1/2 md:h-full w-full h-44 flex-shrink-0" style={!props.article ? {} : {
            backgroundImage: `url(${getArticlePreviewImageUrl(props.article)})`,
            backgroundSize: 'cover',
            backgroundPosition: '50% 50%'
        }}/>
        <div className="p-4 md:p-8 flex flex-col">
            {!props.article || <>
              <div className="uppercase text-primary1 font-semibold my-1">{props.article?.resort}</div>
              <Link href={getArticleLink(props.article)}>
                <div className="text-2xl font-bold md:font-semibold md:text-4xl cursor-pointer line-clamp-2">
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
            className={`flex flex-col lg:flex-row p-4 cursor-pointer bg-white shadow rounded-lg h-32 ${!props.article && 'shimmer'}`}>
            <div className="flex flex-col overflow-hidden">
                <div className="uppercase text-primary1 text-sm">{props.article?.resort}</div>
                <div className="line-clamp-1 font-semibold">{props.article?.title}</div>
                <div className="line-clamp-2">{props.article?.content}</div>
            </div>
        </div>
    </Link>;
}

function AllArticlesCard() {
    return <Link href="/artikel">
        <div className="p-2 cursor-pointer p-4 bg-white shadow rounded-lg">
            <div className="flex flex-col overflow-hidden">
                <div className="uppercase text-primary1 text-sm">Weiteres</div>
                <div className="line-clamp-1 font-semibold">Alle Beiträge</div>
            </div>
        </div>
    </Link>;
}

export default function Articles() {
    const [articles] = useArticleStore(state => [state.items, state.load()]);
    return <Section title="Aktuelles">
        <div className="flex flex-col md:flex-row">
            <BigArticle article={articles[0]}/>
            <div className="flex flex-col mt-6 md:mt-0 md:w-96 md:ml-4 space-y-2">
                <SmallArticleCard article={articles[1]}/>
                <SmallArticleCard article={articles[2]}/>
                <AllArticlesCard/>
            </div>
        </div>
    </Section>;
}