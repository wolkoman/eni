import Site from '../components/Site';
import TopBar from '../components/TopBar';
import {Instagram} from "../components/Instagram";
import {ChristmasDisplay} from "../components/ChristmasDisplay";
import {EmmausBranding} from "../components/EmmausBranding";
import EmmausSections from "./EmmausSections";
import {ComingUp} from "../components/calendar/ComingUp";
import {EniHero} from "../components/EniHero";
import React from "react";
import {WorshipNotice} from "../components/WorshipNotice";
import Responsive from "../components/Responsive";
import {loadEvents} from "./(domain)/events/EventsLoader";
import {EventLoadAccess} from "./(domain)/events/EventLoadOptions";
import {site} from "./(shared)/Instance";
import {fetchInstagramFeed} from "./(shared)/Instagram";
import {fetchEmmausSites} from "./(shared)/Sites";
import {fetchArticles} from "./(shared)/Articles";
import {fetchEmmausbote} from "./(shared)/Weekly";
import {EniSections} from "./EniSections";
import {EniInformation} from "./EniInformation";

export const revalidate = 300

export default async function HomePage() {
  const eventsObject = await loadEvents({access: EventLoadAccess.PUBLIC})
  return site(async () => <Site
    responsive={false} navbar={false}
    description="Drei Pfarren im Wiener Dekanat 23"
    keywords={["Katholisch", "Pfarre", "Glaube", "Gemeinschaft"]}>
    <TopBar frontpage={true}/>
    <EniHero/>
    <ChristmasDisplay eventsObject={eventsObject}/>
    <Responsive size="md">
      <ComingUp eventsObject={eventsObject}/>
      <EniSections/>
      <Instagram items={await fetchInstagramFeed()}/>
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
      <EmmausSections items={await fetchArticles()} sites={await fetchEmmausSites()} emmausbote={await fetchEmmausbote()}/>
      <ComingUp eventsObject={eventsObject}/>
      <Responsive>
        <Instagram items={await fetchInstagramFeed()}/>
      </Responsive>
    </div>
  </Site>)();
}
