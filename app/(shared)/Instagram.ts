import {get} from "@vercel/edge-config";
import {getInstagramTitle} from "./ChatGpt";
import {InstagramFeedItem} from "../../components/InstagramFeedItem";

export async function fetchInstagramFeed(): Promise<InstagramFeedItem[]> {
    const {token}: any = await get('instagram_config')
    const fields = "id,ig_id,media_type,media_url,permalink,timestamp,caption";

    return await fetch(`https://graph.instagram.com/me/media?fields=${fields}&limit=9&access_token=${token}`)
        .then(response => response.json())
        .then(response => response.data
            ?.filter((post: any) => post.caption?.toLowerCase())
            .slice(0, 15) ?? []
        )
        .then(items => Promise.all(items.map(async (item: any) => ({
              ...item,
              title: await getInstagramTitle(item.caption),
          }))))
        .then(async data => {
            //await Cockpit.collectionSave("internal-data", {_id: Cockpit.InternalId.InstagramCache, data});
            return data;
        })
        .catch((e) => {
            return []
            //return Cockpit.collectionGetCached("internal-data", {filter: {id: "instagram-cache"}}).then(x => x.entries[0].data);
        });

}
