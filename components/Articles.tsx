import Link from 'next/link';
import * as React from 'react';
import {useEffect} from 'react';
import Button from './Button';
import {useRouter} from 'next/router';
import {cockpit} from '../util/cockpit-sdk';
import {useArticleStore} from '../util/store';
import {Collections} from 'cockpit-sdk';
import {SectionHeader} from './SectionHeader';

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

  return <>
    <SectionHeader>Aktuelles</SectionHeader>
    <div className="flex flex-col md:flex-row lg:-mx-16 xl:-mx-24">

      <div className={`flex break-words bg-white shadow-lg rounded-xl overflow-hidden items-stretch w-full ${loading && 'shimmer h-80'}`} data-testid="articles">

        <div className="w-1/2 flex-shrink-0" style={loading ? {} : {
          backgroundImage: `url(${getArticlePreviewImageUrl(articles[0])})`,
          backgroundSize: 'cover',
          backgroundPosition: '50% 50%'
        }}/>

        <div className="px-4 md:px-8 py-4 flex flex-col">
          {loading || <>
          <div className="uppercase text-primary1 font-semibold my-1">{articles[0]?.resort}</div>
          <Link href={ getArticleLink(articles[0])}>
            <div className="text-xl font-bold md:font-normal md:text-3xl md:text-4xl cursor-pointer">{articles[0].title}</div>
          </Link>
          <div className="text-lg leading-7 mt-2 line-clamp-4">
            {articles[0].content}
          </div>
          <div className="flex justify-end">
            <Link href={getArticleLink(articles[0])}><a>
              <Button label="Weiterlesen"/></a>
            </Link>
          </div>
          </>}
        </div>
      </div>

      <div className="flex flex-col mt-6 md:mt-0 md:w-96 ml-4">
        {articles.slice(1, 4).map((article, index) => <Link href={getArticleLink(article)} key={article._id}>
          <div
            className={`flex flex-col lg:flex-row p-2 cursor-pointer ${index === 2 && 'hidden md:block'}`}>
            <div className="flex flex-col overflow-hidden">
              <div className="uppercase text-primary1 text-sm">{article.resort ?? 'Neues'}</div>
              <div className="line-clamp-2  font-semibold">{article.title}</div>
            </div>
          </div>
        </Link>)}
        <Link href="/artikel">
          <div
            className="flex flex-col lg:flex-row p-2 cursor-pointer">
            <div className="flex flex-col overflow-hidden">
              <div className="uppercase text-primary1 text-sm">Weiteres</div>
              <div className="line-clamp-2  font-semibold">Alle Beiträge</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  </>;
}