import {get} from "@vercel/edge-config";
import {site} from "./Instance";
import {getInstagramTitle} from "./ChatGpt";
import {Cockpit} from "../../util/cockpit";
import {unstable_cache} from "next/cache";

export const fetchCachedInstagramFeed = async () => {
    const {token}: any = await get('instagram_config')
    return await unstable_cache(() => fetchInstagramFeed(token), ["instagram"], {revalidate: 3600, tags: ["instagram"]})();
};

export async function fetchInstagramFeed(token: string) {
    const fields = "id,media_type,media_url,permalink,timestamp,caption";

    return await fetch(`https://graph.instagram.com/me/media?fields=${fields}&limit=9&access_token=${token}`)
        .then(response => response.json())
        .then(response => response.data
            ?.filter((post: any) => post.caption?.toLowerCase().includes(site('', 'emmaus')))
            .slice(0, 15) ?? []
        )
        .then(items => Promise.all(items.map(async (item: any) => ({
            ...item,
            title: await getInstagramTitle(item.caption),
            children: await fetch(`/${item.id}/children?fields={fields}&access_token={access-token}/children?fields=${fields}&access_token=$
            {access-token}`)
        }))))
        .then(async data => {
            //await Cockpit.collectionSave("internal-data", {_id: Cockpit.InternalId.InstagramCache, data});
            return data;
        })
        .catch(() => {
            console.log("INSTAGRAM FAILED")
            return []
            //return Cockpit.collectionGetCached("internal-data", {filter: {id: "instagram-cache"}}).then(x => x.entries[0].data);
        });

}
