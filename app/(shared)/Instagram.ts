import {get} from "@vercel/edge-config";
import {site} from "@/app/(shared)/Instance";
import {getInstagramTitle} from "@/app/(shared)/ChatGpt";
import {Cockpit} from "@/util/cockpit";

export async function fetchInstagramFeed() {
    const {token}: any = await get('instagram_config')
    const fields = "id,media_type,media_url,permalink,timestamp,caption";

    return await fetch(`https://graph.instagram.com/me/media?fields=${fields}&limit=100&access_token=${token}`)
        .then(response => response.json())
        .then(response => response.data
            ?.filter((post: any) => post.caption?.toLowerCase().includes(site('', 'emmaus')))
            .slice(0, 9) ?? []
        )
        .then(items => Promise.all(items.map(async (item: any) => ({
            ...item,
            title: await getInstagramTitle(item.caption)
        }))))
        .then(async data => {
            await Cockpit.collectionSave("internal-data", {_id: Cockpit.InternalId.InstagramCache, data});
            return data;
        })
        .catch(() => {
            return Cockpit.collectionGet("internal-data", {filter: {id: "instagram-cache"}}).then(x => x.entries[0].data);
        });

}
