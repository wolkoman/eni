import {NextApiRequest, NextApiResponse} from 'next';
import {google} from 'googleapis';

export default function (req: NextApiRequest, res: NextApiResponse){

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_KEY,
    "https://eni.wien/api/google/callback"
  );

  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,

  });

  res.redirect(url);

}
