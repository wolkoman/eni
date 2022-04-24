import {NextApiRequest, NextApiResponse} from 'next';
import {cockpit} from '../../util/cockpit-sdk';
import {site} from "../../util/sites";

export default async function handler(req: NextApiRequest, res: NextApiResponse){

  const instagramData = await cockpit.collectionGet("internal-data", {filter: {id: "instagram"}});
  const instagramToken = instagramData.entries[0].data.token;

  const feed = await fetch(`https://graph.instagram.com/me/media?fields=id,media_type,media_url,username,timestamp,caption&limit=100&access_token=${instagramToken}`)
    .then(response => response.json())
    .then(response => {
      return response.data.filter((post:any) => post.caption.toLowerCase().includes(site('', 'emmaus'))).slice(0, 15);
    });

  res.json(feed);

}
