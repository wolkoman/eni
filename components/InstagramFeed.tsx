import {useEffect, useState} from 'react';

interface InstagramFeedItem{
  id: string,
  media_type: 'CAROUSEL_ALBUM' | 'VIDEO' | 'IMAGE',
  media_url: string, username: string,
  timestamp: string, caption: string,
}

export function InstagramFeed() {
  const [feed, setFeed] = useState<InstagramFeedItem[]>([]);
  useEffect(() => {
    fetch("/api/instagram").then(response => response.json()).then(response => setFeed(response));
  }, [])

  return <div>
    <div className="text-xl font-bold my-2">Instagram</div>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {feed.filter(item => item.media_type !== "VIDEO").slice(0,4).map((item, index) =>
      <div className={`pb-4 ${index === 3 ? "md:hidden" : ""}`}>
        <div className="rounded overflow-hidden" style={{ backgroundImage: `url(${item.media_url})`, backgroundSize: 'cover', height: 250 }}>
          <div className="bg-gray-200 inline-block px-1 rounded-br-lg text-gray-600">{new Date(item.timestamp).toLocaleDateString()}</div>
        </div>
        <div>{item.caption}</div>
      </div>
      )}
    </div>
  </div>;
}