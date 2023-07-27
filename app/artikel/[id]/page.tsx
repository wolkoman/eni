import React from 'react';
import {cockpit} from '../../../util/cockpit-sdk';
import {Article as ArticleSite} from '../../../components/Article';
import {site} from '../../../util/sites';

export const revalidate = 300

export default async function Article({params}: { params: { id: string } }) {

  const article = (await cockpit.collectionGet('article', {
    filter: {
      platform: site('eni', 'emmaus'),
      _id: params.id
    }
  })).entries[0];

  const previewImagePath = article.preview_image.path.startsWith("http")
    ? article.preview_image.path
    : `${cockpit.host}/${article.preview_image.path}`;

  return <ArticleSite image={previewImagePath} title={article.title} created={article._created} author={article.author}>
    {article.layout?.map(layoutEntity => ({
      text: <div key={layoutEntity.component} dangerouslySetInnerHTML={{__html: layoutEntity.settings.text}}
                 className="custom-html mx-auto max-w-xl py-2"/>
    }[layoutEntity.component]))}
  </ArticleSite>;
}