"use server"
import {google} from "googleapis";
import {get} from "@vercel/edge-config";

export async function getGoogleAuthClient() {
    const google_config: any = await get('google_config');
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_KEY,
        "https://eni.wien/termine/google/callback"
    );
    oauth2Client.setCredentials(google_config);
    return oauth2Client;
}
