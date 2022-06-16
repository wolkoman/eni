import {SectionHeader} from './SectionHeader';
import Responsive from "./Responsive";
// @ts-ignore
import Aesthetically from "./../node_modules/aesthetically/aesthetically.js";

export interface InstagramFeedItem {
    id: string,
    media_type: 'CAROUSEL_ALBUM' | 'VIDEO' | 'IMAGE',
    media_url: string,
    username: string,
    timestamp: string,
    caption: string,
}

export function Instagram(props: { items: any[] }) {
    const feed = props.items;

    return <div data-testid="instagram">
        <Responsive>
            <SectionHeader>Einblick ins Pfarrleben</SectionHeader>
            <div className="grid grid-cols-1 gap-4">
                {feed.length === 0 && Array(3).fill(0).map((_, index) =>
                    <InstagramItem key={index}/>
                )}
                {feed
                    .filter(item => item.media_type !== 'VIDEO')
                    .map((item) => <InstagramItem key={item.id} item={item}/>)}
                {feed.length > 0 &&
                    <div
                        className="w-full h-64 text-xl text-center flex items-center justify-center bg-black/10 rounded-lg">
                        <div>
                            Weitere Bilder<br/>sind auf unserem<br/>
                            <a href="//instagram.com/eni.wien/" className="font-bold underline">Instagram Profil</a>
                        </div>
                    </div>}

            </div>
        </Responsive>
    </div>;
}

function InstagramItem({item}: { item?: InstagramFeedItem }) {
    return <div
        className="flex flex-col md:flex-row border-8 border-black/10 rounded-2xl relative md:odd:translate-x-8 md:even:-translate-x-8 overflow-hidden">
        <div
            style={{backgroundImage: `url(${item?.media_url})`}}
            className={`bg-cover relative bg-center ${item == null && 'shimmer'} aspect-square h-80 text-right group shadow`}>
        </div>
        <div>
            <div className="text-xl p-5">
                <div
                    className="inline-block text-lg px-1 bg-black/10 font-bold rounded mr-4 mb-4">{item == null || new Date(item?.timestamp ?? 0).toLocaleDateString("de-AT")}</div>
                <div>{Aesthetically.unformat(item?.caption.normalize() ?? '')}</div>
            </div>
        </div>

    </div>;
}