import {NextApiRequest, NextApiResponse} from 'next';
import {cockpit} from '@/util/cockpit-sdk';
import {getGoogleAuthClient} from "@/app/(shared)/GoogleAuthClient";
import {notifyAdmin} from "@/app/(shared)/Telegram";

export default async function handler(req: NextApiRequest, res: NextApiResponse){

  const client = await getGoogleAuthClient()

  await client.refreshAccessToken(async (err:any, tokens:any) => {
    if(err){
      await notifyAdmin("Token refresh not successful " + err.toString());
    }else{
      await cockpit.collectionSave('internal-data', {_id: "60d2474f6264631a2e00035c", data: tokens});
    }
    console.log({err, tokens})
    res.json({});
  })

}
