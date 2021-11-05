import Site from '../../components/Site';
import React from 'react';
import Link from 'next/link';
import {getArticleLink, getArticlePreviewImageUrl} from '../../components/Articles';
import {cockpit} from '../../util/cockpit-sdk';
import {Collections} from 'cockpit-sdk';
import {SectionHeader} from '../../components/SectionHeader';

export default function Events(props: {articles: Collections['article'][]}) {
  return <Site>
    <SectionHeader>Alle Beiträge</SectionHeader>
    {props.articles.map(article => <Link href={getArticleLink(article)}><div className="flex items-center mb-4 cursor-pointer">
      <img src={getArticlePreviewImageUrl(article)} className="w-16 mr-4" alt="article-review"/>
      <div>
        <div className="">{new Date(article._created * 1000).toLocaleDateString()}</div>
        <div className="font-bold text-lg">{article.title}</div>
      </div>
    </div></Link>)}
  </Site>;
}


export async function getServerSideProps() {
  return {
    props: {
      articles: (await cockpit.collectionGet('article', {filter: {platform: "eni"}})).entries
    }
  }
}