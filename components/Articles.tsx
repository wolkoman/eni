import Link from 'next/link';
import * as React from 'react';
import {CockpitArticle, CockpitArticles} from '../util/cockpit';
import Button from './Button';
import {useRouter} from 'next/router';
import {cockpit} from '../util/cockpit-sdk';

export function getArticlePreviewImageUrl(article: CockpitArticle){
  const url = article.preview_image.path;
  return url.startsWith("https") ? url : `${cockpit.host}${url}`;
}

export function getArticleLink(article: CockpitArticle) {
  return article.external_url || `/artikel/${article._id}`;
}

export default function Articles({articles}: { articles: CockpitArticles }) {
  const articleMax = 300;
  const router = useRouter();

  return <div>
    <div className="pt-12 grid md:grid-cols-2">
      <div className="h-80 rounded-sm" style={{
        backgroundImage: `url(${getArticlePreviewImageUrl(articles[0])})`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%'
      }}/>
      <div className="md:pl-8 flex flex-col">
        <div className="uppercase text-primary1 font-bold mb-1 mt-3">{articles[0].resort}</div>
        <div className="text-4xl font-bold">{articles[0].title}</div>
        <div className="text-lg leading-7 mt-2">
          {articles[0].content.substring(0, articleMax)}{articles[0].content.length > articleMax ? '...' : ''}
        </div>
        <div className="flex justify-end"><Button label="Weiterlesen" onClick={() => router.push(getArticleLink(articles[0]))}/></div>
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

  </div>;
}