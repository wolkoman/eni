import Site from '../../components/Site';
import React from 'react';
import {getArticleLink, getCockpitResourceUrl} from '../EmmausSections';
import {Clickable} from "../(shared)/Clickable";
import {Cockpit} from "../../util/cockpit";
import {site} from "../(shared)/Instance";

export const revalidate = 300

export default async function Events() {

  const articles = await Cockpit.collectionGet('article', {filter: {platform: site('eni', 'emmaus')}, sort: {_created: -1}}).then(x => x.entries)

  return <Site title="Alle Beiträge" showTitle={true}>
    {articles.map(article => <Clickable href={getArticleLink(article)} className="flex items-start mt-4">
      <img src={getCockpitResourceUrl(article.preview_image.path)} className="w-20 mx-2 mt-4 rounded" alt="article-review"/>
      <div className="py-3">
        <div className="italic -mb-1">{new Date(article._created * 1000).toLocaleDateString("de-AT")}</div>
        <div className="font-bold text-xl">{article.title}</div>
      </div>
    </Clickable>)}
  </Site>;
}
