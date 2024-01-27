import {NextResponse} from "next/server";
import {spotifyRedirectUri} from "@/app/(emmaus-only)/fiesta/data";

export const dynamic = "force-dynamic"


export async function GET(request: Request) {


  function generateRandomString(count: number) {
    const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyt"
    return Array.from({length: count}).map(() => pool[Math.floor(Math.random() * pool.length)]).join("");
  }

  function querystring(object: Record<string, any>){
    return Object.entries(object).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&")
  }

  const s = querystring({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: "user-read-currently-playing user-read-playback-state",
    redirect_uri: spotifyRedirectUri,
    state: generateRandomString(16)
  });
  console.log(s)
  return NextResponse.redirect('https://accounts.spotify.com/authorize?' +
      s
  );

}
