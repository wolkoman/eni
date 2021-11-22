import Link from 'next/link';
import * as React from 'react';
import {useEffect} from 'react';
import Button from './Button';
import {useRouter} from 'next/router';
import {cockpit} from '../util/cockpit-sdk';
import {useArticleStore} from '../util/store';
import {Collections} from 'cockpit-sdk';

export function getArticlePreviewImageUrl(article: Collections['article']) {
  const url = article.preview_image.path;
  return url.startsWith('https') ? url : `${cockpit.host}${url}`;
}

export function getArticleLink(article: Collections['article']) {
  return article.external_url || `/artikel/${article._id}`;
}

export default function Articles() {
  const [articles, articleLoaded, articleLoad] = useArticleStore(state => [state.items, state.loaded, state.load]);
  useEffect(() => articleLoad(), []);
  const articleMax = 300;
  const router = useRouter();
  const loading = articles.length < 4;

  return loading ? <ArticleShadow/> : <>
    <div className="flex md:grid grid-cols-2 break-words mt-8" data-testid="articles">
      <div className="w-full h-40 md:h-80 mr-4 rounded-lg" style={{
        backgroundImage: `url(${getArticlePreviewImageUrl(articles[0])})`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%'
      }}/>
      <div className="md:pl-4 flex flex-col">
        <div className="uppercase text-primary1 font-semibold my-1">{articles[0].resort}</div>
        <Link href={getArticleLink(articles[0])}>
          <div className="text-3xl md:text-4xl cursor-pointer">{articles[0].title}</div>
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
            className="flex flex-col lg:flex-row hover:bg-gray-100 p-2 cursor-pointer hover:bg-gray-200 rounded-lg">
            <div className="flex flex-col overflow-hidden">
              <div className="uppercase text-primary1 font-semibold">{article.resort ?? 'Neues'}</div>
              <div className="truncate">{article.title}</div>
            </div>
          </div>
        </Link>)}
      </div>
      <Link href="/artikel">
        <div className="p-2 flex items-center cursor-pointer hover:bg-gray-200 rounded-lg">
          <img src="./logos-28.svg" className="w-8"/>
        </div>
      </Link>
    </div>
  </>;
}

const ArticleShadow = () => <>
  <div className="flex md:grid grid-cols-2 mt-8">
    <div className="w-full md:w-full h-40 md:h-80 mr-4 rounded-lg shimmer"/>
    <div className="w-full md:pl-4 flex flex-col">
      <div className="my-1">
        <div className="shimmer h-5 w-20 rounded"/>
      </div>
      <div className="my-2">
        <div className="shimmer h-12 w-56 rounded"/>
      </div>
      <div className="hidden md:block">
        <div className="shimmer h-44 rounded"/>
      </div>
      <div className="hidden md:block mt-4">
        <div className="shimmer h-8 w-28 rounded"/>
      </div>
    </div>
  </div>
  <div className="flex pt-6 items-stretch">
    <div className="flex flex-col md:grid md:grid-cols-3 md:gap-4 w-full">
      {Array(3).fill(0).map((article, index) =>
        <div key={index} className="flex flex-col lg:flex-row p-2">
          <div className="flex flex-col overflow-hidden">
            <div className="shimmer h-4 w-20 mb-2 rounded"/>
            <div className="shimmer h-6 w-full rounded"/>
          </div>
        </div>)}
    </div>
    <div className="shimmer w-12 h-44 mt-2 md:h-14 rounded">

    </div>
  </div>
</>;
