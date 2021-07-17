import {NextApiRequest, NextApiResponse} from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse){

  console.log(process.env.INSTAGRAM_TOKEN);
  const feed = await fetch(`https://graph.instagram.com/me/media?fields=id,media_type,media_url,username,timestamp,caption&access_token=${process.env.INSTAGRAM_TOKEN}`)
    .then(response => response.json())
    .then(response => response.data);

  res.json(feed);

}
