import {NextResponse} from "next/server";
import {getGoogleAuthClient} from "@/app/(shared)/GoogleAuthClient";
import {notifyAdmin} from "@/app/(shared)/Telegram";

export async function GET(request: Request) {


  const client = await getGoogleAuthClient();

  const tokens = await new Promise((resolve, reject) => client.refreshAccessToken(async (err:any, tokens:any) => {
    if(err){
      await notifyAdmin("Token refresh not successful " + err.toString());
      reject()
    }else{
      resolve(tokens);
    }
  }));
  console.log(tokens)

  return NextResponse.json(await fetch("https://api.vercel.com/v1/edge-config/ecfg_zsy8szfhtvc7gkco18yqlwzbjogi/items?teamId=wolkoman&token=45a609e8-ff13-49c0-a814-660997081f71", {
      method: "PATCH",
      headers: {Authorization: "Bearer " + process.env.VERCEL_TOKEN, ["Content-Type"]: "application/json; charset=utf-8"},
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
