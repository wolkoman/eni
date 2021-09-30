import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {usePermission} from '../util/usePermission';
import {Permission} from '../util/store';
import Site from './Site';
import Button from './Button';


export default function LoadArticleSite({ type }: { type :'inzersdorf' | 'vatican'}) {
  const [news, setNews] = useState<any>();
  const [images, setImages] = useState<any>({});

  usePermission([Permission.Articles]);
  useEffect(() => {
    fetch(`/api/articles/articles?type=${type}`).then(response => response.json()).then(setNews);
  }, []);

  function loadImage(link: string) {
    let path = link.split(".va/", 2)[1];
    setImages((images: any) => ({...images, [link]: ""}))
    fetch("/api/articles/image?type=vatican", {method: "POST", body: JSON.stringify({link: path})})
      .then(response => response.json())
      .then(response => setImages((images: any) => ({...images, [link]: response.image || null})));
  }
  function addArticle(item: any) {
    fetch("/api/articles/cockpit?type=vatican", {method: "POST", body: JSON.stringify({item})})
      .then(response => response.json())
      .then(({link}) => window.location.replace(link));
  }

  return <Site>
    <div className="">
      {news?.items.map((item: any) => <div key={item.title} className="flex flex-row mb-3">
        <div className="bg-gray-200 w-24 h-24 flex-shrink-0 mr-4">
          {images[item.link] !== undefined
            ? <div className="h-full" style={{backgroundImage: `url(${images[item.link]})`, backgroundSize: "cover", backgroundPosition: "50% 50%"}}/>
            : <div className="flex justify-center items-center underline hover:no-underline cursor-pointer h-full"
                   onClick={() => loadImage(item.link)}>laden</div>
          }
        </div>
        <div>
          <div className="underline hover:no-underline"><Link href={item.link}>{item.title.trim()}</Link></div>
          <div>{item.content.trim()}</div>
          <Button label="Artikel laden" onClick={() => addArticle(item)}/>
        </div>
      </div>) ?? "lädt"}
    </div>
  </Site>
}
