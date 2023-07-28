import {NextApiRequest, NextApiResponse} from 'next';
import {google} from 'googleapis';
import {Cockpit} from "../../../util/cockpit";

export default async function handler(req: NextApiRequest, res: NextApiResponse){

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_KEY,
    "https://eni.wien/api/google/callback"
  );

  const { tokens } = await oauth2Client.getToken(req.query.code as string);

  await Cockpit.collectionSave('internal-data', {_id: "60d2474f6264631a2e00035c", data: tokens});

  //res.json(tokens);
  res.redirect("/");

}
