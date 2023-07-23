import {cockpit} from "./cockpit-sdk";
import {site} from "./sites";
import {getInstagramTitle} from "./getCachedPrompt";

export async function fetchInstagramFeed(){
    const instagramAuth = await cockpit.collectionGet("internal-data", {filter: {id: "instagram"}});
    const instagramToken = instagramAuth.entries[0].data.token;

    return await Promise.reject().then(() => fetch(`https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,timestamp,caption&limit=100&access_token=${instagramToken}`))
        .then(response => response.json())
        .then(response => response.data
            ?.filter((post: any) => post.caption?.toLowerCase().includes(site('', 'emmaus')))
            .slice(0, 9) ?? []
        )
        .then(items => Promise.all(items.map(async (item: any) => ({...item, title: await getInstagramTitle(item.caption)}))))
      .then(async data => {
          await cockpit.collectionSave("internal-data", {_id: "64956068666237420d000118", data});
          return data;
      })
      .catch(() => {
          return cockpit.collectionGet("internal-data", {filter: {id: "instagram-cache"}}).then(x => x.entries[0].data);
      });



}