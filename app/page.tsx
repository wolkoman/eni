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
import {loadCachedEvents} from "./(domain)/events/EventsLoader";
import {EventLoadAccess} from "./(domain)/events/EventLoadOptions";
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
  </Site>)();
}
