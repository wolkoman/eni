import {get} from "@vercel/edge-config";
import {google} from "googleapis";

export async function getGoogleAuthClient() {
    const google_config: any = await get('google_config');
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_KEY,
        "http://eni.wien/termine/google/callback"
    );
    oauth2Client.setCredentials(google_config);
    return oauth2Client;
}
