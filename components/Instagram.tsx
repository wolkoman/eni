import {useEffect, useState} from 'react';
import {fetchJson} from '../util/fetch-util';

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

  return <>{feed.length > 0 && <div className="my-10" data-testid="instagram">
    <div className="text-xl font-bold my-2">Instagram</div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {feed
        .filter(item => item.media_type !== 'VIDEO')
        .slice(0, 4)
        .map((item, index) =>
          <div className={`pb-4 ${index === 3 ? 'md:hidden' : ''}`} key={item.id} data-testid="instagram-item">
            <div style={{backgroundImage: `url(${item.media_url})`, backgroundSize: 'cover'}} className="relative h-64">
              <div className="bg-white inline-block px-1 text-gray-600 absolute top-0 right-2 cursor-default">
                {new Date(item.timestamp).toLocaleDateString()}
              </div>
            </div>
            <div>{item.caption}</div>
          </div>
        )}
    </div>
  </div>}

    {feed?.length === 0 && <div className="my-10" data-testid="instagram">
      <div className="text-xl font-bold my-2">Instagram</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array(3).fill(0)
            .map((_, index) =>
                <div className={`pb-4 ${index === 3 ? 'md:hidden' : ''}`} key={index} data-testid="instagram-item">
                  <div className="relative h-64 bg-gray-100">
                    <div className="bg-white inline-block px-1 text-gray-600 absolute top-0 right-2 cursor-default"/>
                  </div>
                  <div className="w-full h-5 bg-gray-100 my-2"></div>
                  <div className="w-full h-5 bg-gray-100 my-2"></div>
                  <div className="w-full h-5 bg-gray-100 my-2"></div>
                  <div className="w-3/4 h-5 bg-gray-100 my-2"></div>
                </div>
            )}
      </div>
    </div>}

  </>;
}