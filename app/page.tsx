import Site from '../components/Site';
import TopBar from '../components/TopBar';
import {Instagram} from "../components/Instagram";
import {EmmausBranding} from "../components/EmmausBranding";
import EmmausSections, {Articles} from "./EmmausSections";
import {ComingUp} from "../components/calendar/ComingUp";
import {EniHero} from "../components/EniHero";
import {WorshipNotice} from "../components/WorshipNotice";
import Responsive from "../components/Responsive";
import {PrayerWall} from "./(emmaus-only)/gebetswand/PrayerWall";
import {loadCachedEvents} from "@/domain/events/EventsLoader";
import {EventLoadAccess} from "@/domain/events/EventLoadOptions";
import {site} from "./(shared)/Instance";
import {fetchCachedInstagramFeed} from "./(shared)/Instagram";
import {fetchEmmausSites} from "./(shared)/Sites";
import {EniSections} from "./EniSections";
import {fetchArticles} from "./(shared)/Articles";
import {fetchEmmausbote} from "./(shared)/Weekly";
import {EniInformation} from "./EniInformation";
import {TodayAndTomorrow} from "../components/TodayAndTomorrow";

export const revalidate = 300

export default async function HomePage() {
  const eventsObject = await loadCachedEvents({access: EventLoadAccess.PUBLIC})
  return site(async () => <Site
      responsive={false} navbar={false}
      description="Drei Pfarren im Wiener Dekanat 23"
      keywords={["Katholisch", "Pfarre", "Glaube", "Gemeinschaft"]}>
      <TopBar frontpage={true}/>
      <EniHero/>
      <Responsive size="md">
        <TodayAndTomorrow eventsObject={eventsObject}/>
        <ComingUp eventsObject={eventsObject}/>
        <EniSections/>
        <Instagram items={await fetchCachedInstagramFeed()}/>
        <EniInformation/>
      </Responsive>
    </Site>, async () => <Site
      responsive={false} navbar={false}
      description="Eine katholische Pfarre im Wiener Dekanat 23"
      keywords={["Katholisch", "Pfarre", "Glaube", "Gemeinschaft"]}>
      <div className="md:sticky inset-0 w-full">
        <TopBar frontpage={true}/>
        <EmmausBranding eventsObject={eventsObject}/>
      </div>
      <WorshipNotice worshipEvents={eventsObject.events.filter(event => event.summary === "Worship")}/>

      <div className="relative z-10 bg-[#e9efef] ">
        <Responsive size="sm">
          <div className="my-24 flex flex-col gap-8">
            <div className="flex justify-between text-md">
              <div className="font-bold">Nachricht aus dem Pfarrgemeinderat</div>
              <div className="text-right">Dienstag, 13.02.2024</div>
            </div>
            <div className="font-serif flex flex-col gap-2">
              <div>Liebe Pfarrgemeinde!</div>
              <div>Zu Beginn der österlichen Bußzeit möchten wir Sie schweren Herzens über Entwicklungen informieren,
                die unsere Gemeinde betreffen. Konflikte in Nachbarpfarren haben nun auch Auswirkungen auf uns:  Die ED Wien plant ein neues Pastoral-Team ab dem 1. September 2024 für die Betreuung unserer Pfarre einzusetzen, da unser geschätzter Pfarrer Zvonko seine Tätigkeit leider nicht weiterführen kann.
                Es scheint, dass die notwendige Unterstützung seitens der Erzdiözese für Seelsorger zu wünschen übrig lässt.
              </div>
              <div>Wir, die Mitglieder des Pfarrgemeinderates, sind zutiefst besorgt über diese Entwicklung. Es fällt uns
                schwer zu verstehen, weshalb unsere Nachbarpfarren, die Möglichkeit zum Dialog mit der Erzdiözese hatte, während unsere
                Meinungen und Ansichten übergangen wurden.
                Wir engagieren uns dafür, Gehör zu finden und wollen konstruktiv mit den Verantwortlichen Probleme lösen,
                während wir klar auf Missstände in Entscheidungsfindung und Kommunikation hinweisen.
              </div>
              <div>
                Wir möchten diesen Moment auch nutzen, um den Zusammenhalt und die Stärke unserer Gemeinde zu betonen. Es
                ist jetzt wichtiger denn je, zusammenzustehen und Wege zu finden, wie wir diese Phase mit Zuversicht und
                gemeinsamem Engagement angehen können.
              </div>
              <div>
                Falls Sie Gedanken, die Sie teilen möchten, Sorgen oder Vorschläge haben, möchten wir Sie ermutigen, sich
                zu melden. Der
                Pfarrgemeinderat steht Ihnen als Ansprechpartner zur Verfügung und ist offen für jeglichen Dialog.
              </div>
              <div className="text-right italic">
                Der Pfarrgemeinderat der Pfarre Emmaus am Wienerberg
              </div>
            </div>
          </div>
        </Responsive>
      </div>
      <div className="relative z-10 bg-white">
        <Responsive>
          <div className="grid lg:grid-cols-2 gap-8 my-8">
            <TodayAndTomorrow eventsObject={eventsObject}/>
            <Articles items={await fetchArticles()}/>
          </div>
        </Responsive>
        <EmmausSections
          sites={await fetchEmmausSites()}
          emmausbote={await fetchEmmausbote()}
        />
        <Responsive>
          <ComingUp eventsObject={eventsObject}/>
          <PrayerWall/>
          <Instagram items={await fetchCachedInstagramFeed()}/>
        </Responsive>
      </div>
    </Site>
  )();
}
