import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {usePermission} from '../../util/usePermission';
import {Permission} from '../../util/store';
import Site from '../../components/Site';
import Button from '../../components/Button';


export default function InternArticles() {
  const [newsItems, setNewsItems] = useState<any>([]);
  const [images, setImages] = useState<any>({});

  usePermission([Permission.Articles]);
  useEffect(() => {
    function fetchItems(type: string) {
      fetch(`/api/articles/articles?type=${type}`)
        .then(response => response.json())
        .then(news => setNewsItems((x: any) => [...x, ...news.items.map((item: any) => ({
          ...item,
          type
        }))].sort(item => item.isoDate)))
        .then();
    }

    fetchItems('inzersdorf');
    fetchItems('vatican');
  }, []);

  function loadImage({ link, type }: { link: string, type: string }) {
    let path = link.split('.va/', 2)[1];
    setImages((images: any) => ({...images, [link]: ''}))
    fetch(`/api/articles/image?type=${type}`, {method: 'POST', body: JSON.stringify({link: path})})
      .then(response => response.json())
      .then(response => setImages((images: any) => ({...images, [link]: response.image || null})));
  }

  function addArticle(item: any) {
    fetch(`/api/articles/cockpit?type=${item.type}`, {method: 'POST', body: JSON.stringify({item})})
      .then(response => response.json())
      .then(({link}) => window.location.replace(link));
  }

  return <Site title="Artikel Importer">
    <div className="">
      {newsItems.map((item: any) => <div key={item.title} className="flex flex-row my-6">
        <div className="bg-gray-200 w-24 h-24 flex-shrink-0 mr-4 rounded overflow-hidden">
          {images[item.link] !== undefined
            ? <div className="h-full" style={{
              backgroundImage: `url(${images[item.link]})`,
              backgroundSize: 'cover',
              backgroundPosition: '50% 50%'
            }}/>
            : <div className="flex justify-center items-center underline hover:no-underline cursor-pointer h-full"
                   onClick={() => loadImage(item)}>laden</div>
          }
        </div>
        <div className="w-full">
          <div className="flex">
            <div className="flex w-full">
              <div className="uppercase bg-gray-200 text-sm px-1 py-0.5 mr-2 rounded">{item.type}</div>
              <Link href={item.link}>
                <div className="underline hover:no-underline">{item.title.trim()} </div>
              </Link>
            </div>
            <div>{new Date(item.isoDate).toLocaleDateString()}</div>
          </div>
          <div>{item.content.trim()}</div>
          <div className="flex justify-end">
            <Button label="Artikel laden" onClick={() => addArticle(item)}/>
          </div>
        </div>
      </div>) ?? 'lädt' /* */}
    </div>
  </Site>
}
