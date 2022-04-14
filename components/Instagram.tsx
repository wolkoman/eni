import {useEffect, useState} from 'react';
import {fetchJson} from '../util/fetch-util';
import {SectionHeader} from './SectionHeader';
import {siteType, SiteType} from '../util/sites';

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
        fetchJson('/api/instagram')
            .then(response => setFeed(response))
            .catch(() => setFeed([]));
    }, [])

    return <div className="my-10" data-testid="instagram">
        <SectionHeader>Einblick ins Pfarrleben</SectionHeader>
        <div className="grid grid-cols-5">
        {feed.length === 0 && Array(3).fill(0).map((_, index) =>
            <InstagramItem key={index}/>
        )}
        {feed
            .filter(item => item.media_type !== 'VIDEO')
            .filter(item => siteType === SiteType.ENI || item.caption.includes("#emmaus"))
            .map((item) =>
                <InstagramItem item={item}/>
            )}
        {feed.length > 0 &&
            <div className="w-full h-96 text-xl text-center flex items-center justify-center cursor-all-scroll">
                <div>
                    Weitere Bilder<br/>auf unserem{' '}
                    <a href="//instagram.com/eni.wien/" className="text-primary1 font-bold underline">Instagram</a>
                </div>
            </div>}

        </div>
    </div>;
}

function InstagramItem({item}: { item?: InstagramFeedItem }) {
    return <div
            style={{backgroundImage: `url(${item?.media_url})`, backgroundSize: 'cover'}}
            className={`relative bg-center ${item == null && 'shimmer'} aspect-square text-right`}>
            {item?.caption}
            <div
                className="bg-white inline-block px-2 text-right cursor-default rounded-bl font-bold">
                {item == null || new Date(item?.timestamp ?? 0).toLocaleDateString()}
            </div>

    </div>;
}