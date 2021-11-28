import {useEffect, useState} from 'react';
import {fetchJson} from '../util/fetch-util';
import {SectionHeader} from './SectionHeader';
import {Swiper, SwiperSlide} from 'swiper/react';

interface InstagramFeedItem {
  id: string,
  media_type: 'CAROUSEL_ALBUM' | 'VIDEO' | 'IMAGE',
  media_url: string,
  username: string,
  timestamp: string,
  caption: string,
}

export function Instagram() {
  const [feed, setFeed] = useState<InstagramFeedItem[]>([]);
  useEffect(() => {
    fetchJson('/api/instagram').then(response => setFeed(response)).catch(() => setFeed([]));
  }, [])

  return <div className="my-10" data-testid="instagram">
    <SectionHeader>Einblick ins Pfarrleben</SectionHeader>
    <Swiper slidesPerView={'auto'} spaceBetween={30} centeredSlides={true} className="mySwiper">
      {feed.length === 0 && Array(3).fill(0).map((_,index) => <SwiperSlide style={{width: 300}}><InstagramItem key={index}/></SwiperSlide>)}
      {feed
        .filter(item => item.media_type !== 'VIDEO')
        .map((item) =>
          <SwiperSlide key={item.id} style={{width: 300}}><InstagramItem item={item}/></SwiperSlide>
        )}
      {feed.length > 0 && <SwiperSlide style={{width: 300}}>
        <div className="w-full h-64 text-xl text-center flex items-center justify-center">
          <div>Weitere Bilder<br/>auf unserem <a href="//instagram.com/eni.wien/" className="text-primary1 font-bold underline">Instagram</a></div>
        </div></SwiperSlide>}
    </Swiper>
  </div>;
}

function InstagramItem({item}: { item?: InstagramFeedItem }) {
  return <div className="pb-4 rounded-xl shadow-lg"
              data-testid="instagram-item">
    <div style={{backgroundImage: `url(${item?.media_url})`, backgroundSize: 'cover'}}
         className={`relative h-64 bg-center rounded-xl ${item == null && 'shimmer'}`}>
      <div className="bg-white inline-block px-2 text-gray-600 absolute top-0 right-0 cursor-default rounded-bl-xl">
        {item == null || new Date(item?.timestamp ?? 0).toLocaleDateString()}
      </div>
    </div>
    <div className="p-2">
      {item?.caption}
      {item == null && <>
        <div className="shimmer w-full h-4 mt-1"/>
        <div className="shimmer w-full h-4 mt-1"/>
        <div className="shimmer w-full h-4 mt-1"/>
        </>}
    </div>
  </div>;
}