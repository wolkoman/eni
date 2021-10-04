import Link from 'next/link';
import * as React from 'react';
import {useEffect} from 'react';
import {CockpitArticle} from '../util/cockpit';
import Button from './Button';
import {useRouter} from 'next/router';
import {cockpit} from '../util/cockpit-sdk';
import {useArticleStore} from '../util/store';

export function getArticlePreviewImageUrl(article: CockpitArticle) {
  const url = article.preview_image.path;
  return url.startsWith('https') ? url : `${cockpit.host}${url}`;
}

export function getArticleLink(article: CockpitArticle) {
  return article.external_url || `/artikel/${article._id}`;
}

const ArticleShadow = () => <>
  <div className="pt-12 grid grid-cols-2">
    <div className="h-40 md:h-80 mr-4 rounded-sm shimmer"/>
    <div className="md:pl-8 flex flex-col">
      <div className="uppercase text-primary1 font-bold mb-1 md:mt-3">
        <div className="shimmer h-6 w-20"/>
      </div>
      <div className="text-4xl font-bold">
        <div className="shimmer h-12 w-56"/>
      </div>
      <div className="text-lg leading-7 mt-2">
        <div className="shimmer h-36"/>
      </div>
    </div>
  </div>
  <div className="flex pt-6 items-stretch">
    <div className="flex flex-col md:grid md:grid-cols-3 md:gap-4 w-full">
      {Array(3).fill(0).map((article, index) =>
        <div key={index}
             className="flex flex-col lg:flex-row p-2">
          <div className="flex flex-col overflow-hidden">
            <div className="text-md uppercase text-primary1 font-bold">
              <div className="shimmer h-4 w-20 mb-2"/>
            </div>
            <div className="text-lg font-semibold truncate">
              <div className="shimmer h-6 w-36"/>
            </div>
          </div>
        </div>)}
    </div>
  </div>
</>;

export default function Articles() {
  const [articles, articleLoaded, articleLoad] = useArticleStore(state => [state.items, state.loaded, state.load]);
  useEffect(() => articleLoad(), []);
  const articleMax = 300;
  const router = useRouter();
  const loading = articles.length < 4;

  return loading ? <ArticleShadow/> : <>
    <div className="pt-12 grid grid-cols-2 break-words">
      <div className="h-40 md:h-80 mr-4 rounded-sm shadow" style={{
        backgroundImage: `url(${getArticlePreviewImageUrl(articles[0])})`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%'
      }}/>
      <div className="md:pl-8 flex flex-col">
        <div className="uppercase text-primary1 font-bold mb-1 md:mt-3">{articles[0].resort}</div>
        <Link href={getArticleLink(articles[0])}>
          <div className="text-4xl font-bold cursor-pointer">{articles[0].title}</div>
        </Link>
        <div className="text-lg leading-7 mt-2 hidden md:block">
          {articles[0].content.substring(0, articleMax)}{articles[0].content.length > articleMax ? '...' : ''}
        </div>
        <div className="flex justify-end hidden md:block">
          <Link href={getArticleLink(articles[0])}><a>
            <Button label="Weiterlesen"/></a>
          </Link>
        </div>
      </div>
    </div>
    <div className="flex pt-6 items-stretch">
      <div className="flex flex-col md:grid md:grid-cols-3 md:gap-4 w-full">
        {articles.slice(1, 4).map(article => <Link href={getArticleLink(article)} key={article._id}>
          <div
            className="flex flex-col lg:flex-row hover:bg-gray-100 p-2 cursor-pointer hover:bg-gray-200">
            <div className="flex flex-col overflow-hidden">
              <div className="text-md uppercase text-primary1 font-bold">{article.resort ?? 'Neues'}</div>
              <div className="text-lg font-semibold truncate">{article.title}</div>
            </div>
          </div>
        </Link>)}
      </div>
      <Link href="/artikel">
        <div className="p-2 flex items-center cursor-pointer hover:bg-gray-200">
          <img src="./logos-28.svg" className="w-8"/>
        </div>
      </Link>
    </div>
  </>;
}