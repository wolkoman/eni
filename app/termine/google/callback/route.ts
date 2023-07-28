import {google} from 'googleapis';
import {NextResponse} from "next/server";

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_KEY,
    "http://localhost:3000/termine/google/callback"
  );

  console.log(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_KEY)
  console.log("req.query", searchParams.get('code'))
  const {tokens} = await oauth2Client.getToken(searchParams.get('code') as string);


  return NextResponse.json(await fetch("https://api.vercel.com/v1/edge-config/ecfg_zsy8szfhtvc7gkco18yqlwzbjogi/items?teamId=wolkoman&token=45a609e8-ff13-49c0-a814-660997081f71", {
      method: "PATCH",
      headers: {Authorization: "Bearer uIb8nZmTus2RJKDgECSu7wDl", ["Content-Type"]: "application/json; charset=utf-8"},
      body: JSON.stringify({
        items: [{
          operation: "update",
          key: "google_config",
          value: tokens
        }]
      })
    }).then(x => x.json())
  )

}
