import Site from '../../components/Site';
import React from 'react';
import {Cockpit, CockpitArticles} from '../../util/cockpit';
import Link from 'next/link';
import {getArticleLink, getArticlePreviewImageUrl} from '../../components/Articles';

export default function Events(props: {articles: CockpitArticles}) {
  return <Site>
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
      articles: await Cockpit.article({platform: "eni"}, {_o: 1})
    }
  }
}