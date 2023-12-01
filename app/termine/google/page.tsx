import {getGoogleAuthClient} from "../../(shared)/GoogleAuthClient";
import Site from "../../../components/Site";
import Button from "../../../components/Button";

export const revalidate = 0;

export default async function Page(){
  const url = await googleUrl()
  return <Site title="Kalender freigeben" narrow={true}>
    <div>
      Hier können Sie ihren Kalender mit uns teilen.
    </div>
    <a href={url}><Button label="Sign in with Google"></Button></a>
  </Site>
}

async function googleUrl(){

  const authClient = await getGoogleAuthClient()

  return authClient.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
  });

}
