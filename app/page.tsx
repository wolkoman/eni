import {site} from "@/app/(shared)/Instance";
import Site from "../components/Site";
import TopBar from "../components/TopBar";
import {EniHero} from "../components/EniHero";
import Responsive from "../components/Responsive";
import {TodayAndTomorrow} from "../components/TodayAndTomorrow";
import {ComingUp} from "../components/calendar/ComingUp";
import {EniSections} from "@/app/EniSections";
import {Instagram} from "../components/Instagram";
import {EmmausBranding} from "../components/EmmausBranding";
import EmmausSections, {Articles} from "@/app/EmmausSections";
import {fetchArticles} from "@/app/(shared)/Articles";
import {fetchEmmausSites} from "@/app/(shared)/Sites";
import {fetchEmmausbote} from "@/app/(shared)/Weekly";
import {PrayerWall} from "@/app/(emmaus-only)/gebetswand/PrayerWall";
import * as React from "react";
import {Alpha} from "@/app/Alpha";

export const revalidate = 300


export default async function HomePage() {
  return site(async () => <Site responsive={false} navbar={false}>
      <TopBar frontpage={true}/>
   <EniHero/>
    <Responsive size="md">
        <TodayAndTomorrow/>
     <ComingUp/>
        <EniSections/>
        <Instagram/>
        {/**<EniInformation/>**/}
      </Responsive>
    </Site>, async () => <Site responsive={false} navbar={false}>
      <div className="md:sticky inset-0 w-full">
        <TopBar frontpage={true}/>
        <EmmausBranding/>
      </div>
      <div className="relative z-10 bg-white">
        <Responsive>
          <div className="grid lg:grid-cols-2 gap-8 my-8">
            <TodayAndTomorrow/>
            <Articles items={await fetchArticles()}/>
          </div>
          {new Date() < new Date("2024-04-09") && <Alpha/>}
        </Responsive>
        <EmmausSections
          sites={await fetchEmmausSites()}
          emmausbote={await fetchEmmausbote()}
        />
        <Responsive>
          <ComingUp/>
          <PrayerWall/>
          <Instagram/>
        </Responsive>
      </div>
    </Site>
  )();
}