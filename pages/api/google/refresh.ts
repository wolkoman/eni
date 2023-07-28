import {NextApiRequest, NextApiResponse} from 'next';
import {getCachedGoogleAuthClient} from "../../../util/calendar-events";
import {notifyAdmin} from "../../../util/telegram";
import {Cockpit} from "../../../util/cockpit";

export default async function handler(req: NextApiRequest, res: NextApiResponse){

  const client = await getCachedGoogleAuthClient()

  await client.refreshAccessToken(async (err:any, tokens:any) => {
    if(err){
      notifyAdmin("Token refresh not successful " + err.toString());
    }else{
      await Cockpit.collectionSave('internal-data', {_id: "60d2474f6264631a2e00035c", data: tokens});
    }
    console.log({err, tokens})
    res.json({});
  })

}
