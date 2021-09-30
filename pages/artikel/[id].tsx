import Site from '../../components/Site';
import React, {useEffect} from 'react';
import {Cockpit, CockpitArticle, cockpitBase} from '../../util/cockpit';

export default function Article({article}: {article: CockpitArticle}) {
  useEffect(() => {if(article.external_url) {
    window.location.replace(article.external_url);
  }},[article.external_url]);
  return <Site>
    <div className="flex flex-col-reverse md:flex-row max-w-2xl mx-auto">
      <div className="flex flex-col mt-12 mb-6">
        <div className="text-5xl font-semibold">{article.title}</div>
        <div className="tracking-wide mt-3">am {new Date(article._created * 1000).toLocaleDateString()} von {article.author}</div>
      </div>
      <div className="flex-shrink-0">
        <img src={`${cockpitBase}/${article.preview_image.path}`} className="h-52 max-w-full mr-4" alt="article-preview"/>
      </div>
    </div>
    <div className="text-lg font-serif">
      {article.layout?.map(layoutEntity => ({
        text: <div dangerouslySetInnerHTML={{__html: layoutEntity.settings.text}} className="custom-html mx-auto max-w-xl py-2" />
      }[layoutEntity.component as 'text'] as any))}
    </div>
  </Site>;
}


export async function getServerSideProps(context: any) {
  return {
    props: {
      article: (await Cockpit.article({platform: "eni", _id: context.params.id}, {_o: 1}))[0]
    }
  }
}