import {NextResponse} from "next/server";
import {get} from "@vercel/edge-config";

export async function GET(request: Request) {

  const google_config: any = await get('google_config');

  return NextResponse.json({
    expires: new Date(google_config.expiry_date).toString()
  })

}
