import React, {useEffect} from 'react';
import {Collections} from 'cockpit-sdk';
import {cockpit} from '../../util/cockpit-sdk';
import {useRouter} from 'next/router';
import {Article as ArticleSite} from '../../components/Article';
import {site} from '../../util/sites';

export default function Article({article}: { article: Collections['article'] }) {
  const router = useRouter();
  const previewImagePath = article.preview_image.path.startsWith("http") ? `${article.preview_image.path}` : `${cockpit.host}/${article.preview_image.path}`;
  useEffect(() => {
    if (article.external_url) {
      router.push(article.external_url);
    }
  }, [article.external_url, router]);
  return <ArticleSite image={previewImagePath} title={article.title} created={article._created} author={article.author}>
    {article.layout?.map(layoutEntity => ({
      text: <div key={layoutEntity.component} dangerouslySetInnerHTML={{__html: layoutEntity.settings.text}}
                 className="custom-html mx-auto max-w-xl py-2"/>
    }[layoutEntity.component]))}
  </ArticleSite>;
}


export async function getServerSideProps(context: any) {
  const article = (await cockpit.collectionGet('article', {
    filter: {
      platform: site('eni', 'emmaus'),
      _id: context.params.id
    }
  })).entries[0];
  return {
    props: {
      article: article
    }
  }
}