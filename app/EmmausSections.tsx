import Link from 'next/link';
import * as React from 'react';
import {cockpit} from '@/util/cockpit-sdk';
import {Collections} from 'cockpit-sdk';
import {Links} from "@/app/(shared)/Links";
import {SectionHeader} from "../components/SectionHeader";
import {fetchArticles} from "@/app/(shared)/Articles";
import {fetchEmmausSites} from "@/app/(shared)/Sites";

export function getCockpitResourceUrl(url: string) {
  if (url.startsWith('https')) return url;
  if (url.startsWith('/storage')) return `${cockpit.host}${url}`;
  if (url.startsWith('storage')) return `${cockpit.host}/${url}`;
  return `${cockpit.host}/storage/uploads/${url}`
}

export function getArticleLink(article?: Collections['article']) {
  return article ? Links.Artikel(article._id) : '';
}


export async function EmmausSections() {
  const sites = await fetchEmmausSites()
  return <div>
    <SectionHeader>Über uns</SectionHeader>
    <div>
      <div className="flex flex-col rounded-lg border border-black/10 shadow bg-white">
        {sites
          .filter(site => site.level === 0)
          .map(site =>
            <Link href={"/seite/" + site.slug} className="px-4 py-2 hover:bg-black/5">
              {site.name}
            </Link>
          )}
      </div>
    </div>
  </div>;
}

export async function Articles() {
  const items = await fetchArticles()
  return <div>
    <SectionHeader>Artikel</SectionHeader>
    <div className="grid bg-white shadow border border-black/10 rounded-lg overflow-hidden">
      <ArticleCard article={items[0]}/>
      <ArticleCard article={items[1]}/>
      <Link href={Links.Artikel()} className="p-1 text-center hover:bg-black/5 font-semibold">
        Alle Beiträge
      </Link>
    </div>
  </div>;
}

function ArticleCard(props: { article?: Collections['article'] }) {
  const readTime = Math.ceil((props.article?.layout.map(x => x.settings.text).join("").split(" ").length ?? 600) / 200);
  return <Link href={getArticleLink(props.article)}
               className="flex flex-row cursor-pointer last-child:border-none border-b border-black/10">
    <div
      className="w-32 aspect-square flex-shrink-0"
      style={!props.article ? {} : {
        backgroundImage: `url(${getCockpitResourceUrl(props.article.preview_image.path)})`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%'
      }}/>
    <div className="flex flex-col justify-center items-start gap-2 px-6 py-2">
      <div className="font-semibold text-xl line-clamp-3">{props.article?.title}</div>
      <div className="bg-black/5 px-1 text-sm rounded">{readTime}min Lesezeit</div>
    </div>
  </Link>;
}
