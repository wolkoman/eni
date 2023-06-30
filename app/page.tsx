import Site from '../components/Site';
import TopBar from '../components/TopBar';
import {getCachedEvents, GetEventPermission} from "../util/calendar-events";
import {fetchArticles} from "../util/fetchArticles";
import {fetchEmmausSites} from "../util/fetchEmmausSites";
import {fetchInstagramFeed} from "../util/fetchInstagram";
import {fetchEmmausbote} from "../util/fetchWeeklies";
import {site} from '../util/sites';
import {Instagram} from "../components/Instagram";
import {ChristmasDisplay} from "../components/ChristmasDisplay";
import {EniSections} from "../components/EniSections";
import {EmmausBranding} from "../components/EmmausBranding";
import Articles from "../components/Articles";
import {ComingUp} from "../components/calendar/ComingUp";
import {EmmausSections} from "../components/EmmausSections";
import {EniHero} from "../components/EniHero";
import React from "react";
import {WorshipNotice} from "../components/WorshipNotice";
import {ComingUp2} from "../components/calendar/ComingUp2";
import Responsive from "../components/Responsive";

export const revalidate = 300

export default async function HomePage() {
  const eventsObject = await getCachedEvents({permission: GetEventPermission.PUBLIC})
  return site(async () => <Site
    responsive={false} navbar={false}
    description="Drei Pfarren im Wiener Dekanat 23"
    keywords={["Katholisch", "Pfarre", "Glaube", "Gemeinschaft"]}>
    <TopBar frontpage={true}/>
    <EniHero/>
    <ChristmasDisplay eventsObject={eventsObject}/>
    <Responsive size="md">
      <ComingUp eventsObject={eventsObject}/>
      {/*<div className="flex p-10 gap-10">
      <div className="w-1/3">
        <ComingUp2 eventsObject={eventsObject}/>
      </div>
      <div className="w-2/3">
        <Instagram items={await fetchInstagramFeed()}/>
      </div>
    </div>*/}
    </Responsive>
    <EniSections/>
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
      <Articles items={await fetchArticles()} sites={await fetchEmmausSites()}/>
      <ComingUp eventsObject={eventsObject}/>
      <EmmausSections emmausbote={await fetchEmmausbote()}/>
      <Instagram items={await fetchInstagramFeed()}/>
    </div>
  </Site>)();
}
