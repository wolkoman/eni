import Site from "../components/Site";
import TopBar from "../components/TopBar";
import Responsive from "../components/Responsive";
import {TodayAndTomorrow} from "@/components/TodayAndTomorrow";
import {ComingUp} from "@/components/calendar/ComingUp";
import {Instagram} from "@/components/Instagram";
import {EmmausBranding} from "@/components/EmmausBranding";
import {Articles, EmmausSections} from "@/app/EmmausSections";
import {PrayerWall} from "@/app/(emmaus-only)/gebetswand/PrayerWall";
import * as React from "react";
import {Alpha} from "@/app/Alpha";
import {Priests} from "@/app/Priests";
import {EmmausboteInfo} from "@/app/EmmausboteInfo";

export const revalidate = 300


export default async function HomePage() {
  return <Site responsive={false} navbar={false}>
      <div className="md:sticky inset-0 w-full">
        <TopBar frontpage={true}/>
        <EmmausBranding/>
      </div>
      <div className="relative z-10 bg-back-emmaus">
        <Responsive>
          <div className="grid lg:grid-cols-2 gap-8 my-8">
            <div className="flex flex-col">
              <TodayAndTomorrow/>
              <EmmausboteInfo/>
            </div>
            <div className="flex flex-col">
              <Articles/>
              <EmmausSections/>
            </div>
          </div>
          {new Date() < new Date("2024-04-09") && <Alpha/>}
        </Responsive>
        <Responsive>
          <ComingUp/>
          <PrayerWall/>
          <Priests/>
          <Instagram/>
        </Responsive>
      </div>
    </Site>;
}
