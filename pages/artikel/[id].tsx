import Site from '../../components/Site';
import React, {useEffect} from 'react';
import {Collections} from 'cockpit-sdk';
import {cockpit} from '../../util/cockpit-sdk';
import {useRouter} from 'next/router';
import Navbar from '../../components/Navbar';
import Responsive from '../../components/Responsive';
import {siteType, SiteType} from '../../util/sites';

export default function Article({article}: { article: Collections['article'] }) {
  const router = useRouter();
  const previewImagePath = article.preview_image.path.startsWith("http") ? `${article.preview_image.path}` : `${cockpit.host}/${article.preview_image.path}`;
  useEffect(() => {
    if (article.external_url) {
      router.push(article.external_url);
    }
  }, [article.external_url, router]);
  return <Site navbar={false} responsive={false}>
    <div className="relative text-white">
      <div className="absolute w-full h-full top-0 left-0 overflow-x-hidden"
           style={{
             backgroundImage: `url(${previewImagePath})`,
             backgroundPosition: 'center center',
             backgroundSize: 'cover',
             filter: 'blur(5px) brightness(0.7) contrast(0.8)'
           }}/>
      <div className="relative z-10">
        <Navbar/>
        <Responsive>
          <div className="flex flex-col-reverse md:flex-row">
            <div className="flex-shrink-0 ml-4">
              <img src={`${previewImagePath}`}
                   className="h-52 max-w-full mr-4 rounded-lg relative top-8"
                   alt="article-preview"/>
            </div>
            <div className="flex flex-col mt-12 mb-6">
              <div className="text-5xl font-bold">{article.title}</div>
              <div
                className="mt-3 italic pt-2">am {new Date(article._created * 1000).toLocaleDateString()} von {article.author}</div>
            </div>
          </div>
        </Responsive>
      </div>
    </div>
    <Responsive>
      <div className="text-lg font-serif mt-12">
        {article.layout?.map(layoutEntity => ({
          text: <div key={layoutEntity.component} dangerouslySetInnerHTML={{__html: layoutEntity.settings.text}}
                     className="custom-html mx-auto max-w-xl py-2"/>
        }[layoutEntity.component]))}
      </div>
    </Responsive>
  </Site>;
}


export async function getServerSideProps(context: any) {
  const article = (await cockpit.collectionGet('article', {
    filter: {
      platform: {[SiteType.ENI]: 'eni',[SiteType.EMMAUS]: 'emmaus'}[siteType],
      _id: context.params.id
    }
  })).entries[0];
  return {
    props: {
      article: article
    }
  }
}