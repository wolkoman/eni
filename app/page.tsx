import {loadCachedEvents} from "@/domain/events/EventsLoader";
import {EventLoadAccess} from "@/domain/events/EventLoadOptions";
import {site} from "@/app/(shared)/Instance";
import Site from "../components/Site";
import TopBar from "../components/TopBar";
import {EniHero} from "../components/EniHero";
import Responsive from "../components/Responsive";
import {TodayAndTomorrow} from "../components/TodayAndTomorrow";
import {ComingUp} from "../components/calendar/ComingUp";
import {EniSections} from "@/app/EniSections";
import {Instagram} from "../components/Instagram";
import {fetchCachedInstagramFeed} from "@/app/(shared)/Instagram";
import {EniInformation} from "@/app/EniInformation";
import {EmmausBranding} from "../components/EmmausBranding";
import {WorshipNotice} from "../components/WorshipNotice";
import EmmausSections, {Articles} from "@/app/EmmausSections";
import {fetchArticles} from "@/app/(shared)/Articles";
import {fetchEmmausSites} from "@/app/(shared)/Sites";
import {fetchEmmausbote} from "@/app/(shared)/Weekly";
import {PrayerWall} from "@/app/(emmaus-only)/gebetswand/PrayerWall";
import * as React from "react";
import {Alpha} from "@/app/Alpha";

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
          {new Date() < new Date("2024-04-09") && <Alpha/>}
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