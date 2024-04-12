"use server"
import {google} from "googleapis";

export async function getGoogleAuthClient() {

  return new google.auth.GoogleAuth({
    credentials: JSON.parse(
      process.env.GOOGLE_SERVICE_ACCOUNT!.replaceAll("\n", " ")
    ),
    scopes: ['https://www.googleapis.com/auth/calendar'], // Add the required scopes for your application
  })
}
