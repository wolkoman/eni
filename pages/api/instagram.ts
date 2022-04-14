import {NextApiRequest, NextApiResponse} from 'next';
import {cockpit} from '../../util/cockpit-sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse){

  const instagramData = await cockpit.collectionGet("internal-data", {filter: {id: "instagram"}});
  const instagramToken = instagramData.entries[0].data.token;

  const feed = await fetch(`https://graph.instagram.com/me/media?fields=id,media_type,media_url,username,timestamp,caption&limit=20&access_token=${instagramToken}`)
    .then(response => response.json())
    .then(response => response.data);

  res.json(feed);

}
