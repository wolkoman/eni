import Site from '../../components/Site';
import React from 'react';
import Link from 'next/link';
import {getArticleLink, getCockpitResourceUrl} from '../../components/Articles';
import {cockpit} from '../../util/cockpit-sdk';
import {site} from '../../util/sites';
import {clickable} from "../../util/styles";

export const revalidate = 300

export default async function Events() {

  const articles = await cockpit.collectionGet('article', {filter: {platform: site('eni', 'emmaus')}, sort: {_created: -1}}).then(x => x.entries)

  return <Site title="Alle Beiträge" showTitle={true}>
    {articles.map(article => <Link href={getArticleLink(article)}>
      <div className={"flex items-start mt-4 " + clickable}>
      <img src={getCockpitResourceUrl(article.preview_image.path)} className="w-20 mx-2 mt-4 rounded" alt="article-review"/>
      <div className="py-3">
        <div className="italic -mb-1">{new Date(article._created * 1000).toLocaleDateString("de-AT")} {article.external_url ? " - extern" : ""}</div>
        <div className="font-bold text-xl">{article.title}</div>
        <div className="">{article.content}</div>
      </div>
    </div></Link>)}
  </Site>;
}