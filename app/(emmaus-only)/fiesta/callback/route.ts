import {NextResponse} from "next/server";
import {spotifyAuthHeader, spotifyRecordId, spotifyRedirectUri} from "@/app/(emmaus-only)/fiesta/login/route";
import {Cockpit} from "@/util/cockpit";

export const dynamic = "force-dynamic"


export async function GET(request: Request) {


  const code = new URL(request.url).searchParams.get("code")!

  var details: Record<string,string> = {
    code: code,
    redirect_uri: spotifyRedirectUri,
    grant_type: 'authorization_code'
  };

  const formBody = Object.entries(details).map(([key,value]) =>
    `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`
  ).join("&")
  console.log(formBody)

  const spotifyCredentials = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: spotifyAuthHeader,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: new URLSearchParams(details).toString()
  }).then(x => x.json());

  if("error" in spotifyCredentials){
    return NextResponse.json(spotifyCredentials);
  }

  await Cockpit.collectionSave("internal-data", {_id: spotifyRecordId, data: spotifyCredentials})
  return NextResponse.json({ok: true});

}
