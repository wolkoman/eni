import {cockpit} from "./cockpit-sdk";
import {site} from "./sites";
import {getInstagramTitle} from "./getCachedPrompt";

export async function fetchInstagramFeed(){
    const instagramData = await cockpit.collectionGet("internal-data", {filter: {id: "instagram"}});
    const instagramToken = instagramData.entries[0].data.token;

    return await fetch(`https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,timestamp,caption&limit=100&access_token=${instagramToken}`)
        .then(response => response.json())
        .then(response => response.data
            ?.filter((post: any) => post.caption?.toLowerCase().includes(site('', 'emmaus')))
            .slice(0, 9) ?? []
        )
        .then(items => Promise.all(items.map(async (item: any) => ({...item, title: await getInstagramTitle(item.caption)}))));

}