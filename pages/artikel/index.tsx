import Site from '../../components/Site';
import React from 'react';
import Link from 'next/link';
import {getArticleLink, getArticlePreviewImageUrl} from '../../components/Articles';
import {cockpit} from '../../util/cockpit-sdk';
import {Collections} from 'cockpit-sdk';
import {SectionHeader} from '../../components/SectionHeader';

export default function Events(props: {articles: Collections['article'][]}) {
  return <Site title="Alle Beiträge">
    {props.articles.map(article => <Link href={getArticleLink(article)}><div className="flex items-start mt-4 cursor-pointer rounded-lg bg-white shadow">
      <img src={getArticlePreviewImageUrl(article)} className="w-20 mx-2 mt-4 rounded" alt="article-review"/>
      <div className="py-3">
        <div className="italic -mb-1">{new Date(article._created * 1000).toLocaleDateString()} {article.external_url ? " - extern" : ""}</div>
        <div className="font-bold text-xl">{article.title}</div>
        <div className="">{article.content}</div>
      </div>
    </div></Link>)}
  </Site>;
}


export async function getServerSideProps() {
  return {
    props: {
      articles: (await cockpit.collectionGet('article', {filter: {platform: "eni"}, sort: {_created: -1}})).entries
    }
  }
}