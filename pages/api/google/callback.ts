import {NextApiRequest, NextApiResponse} from 'next';
import {google} from 'googleapis';
import {cockpit} from '../../../util/cockpit-sdk';

export default async function (req: NextApiRequest, res: NextApiResponse){

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_KEY,
    "https://eni.wien/api/google/callback"
  );

  const { tokens } = await oauth2Client.getToken(req.query.code as string);

  await cockpit.collectionSave("internal-data", {_id: "60d2474f6264631a2e00035c", data: tokens});

  //res.json(tokens);
  res.redirect("/");

}
