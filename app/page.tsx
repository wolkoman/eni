import {site} from "@/app/(shared)/Instance";
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
import {PiArrowRight} from "react-icons/pi";
import Link from "next/link";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";

export const revalidate = 300


export default async function HomePage() {
  return site(async () => <Site responsive={true} navbar={true}>
      <div className="max-w-md flex flex-col gap-2">
        {[CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT]
          .map(calendar => getCalendarInfo(calendar))
          .map(calendar => <Link
            href={calendar.websiteUrl}
            key={calendar.id}
            className="relative border border-black/10 rounded-lg bg-white shadow flex px-2"
          >
            <div className="absolute inset-0 bg"/>
            <div style={{backgroundImage: `url(${calendar.image})`}}
                 className="bg-contain bg-bottom w-24 bg-no-repeat"/>
            <div className="p-4 flex flex-col justify-center gap-2">
              <div className="font-bold">{calendar.fullName}</div>
              <div className="underline decoration border-black/20">{calendar.websiteDisplay}</div>
            </div>
          </Link>)
        }
      </div>
      <Link
        className="flex items-center gap-3 my-4 underline decoration-black/20 hover:decoration-black/40 transition"
        href="/ende">
        <PiArrowRight/>
        <div>Ende der Initiative &bdquo;Miteinander der Pfarren: eni.wien&ldquo;</div>
      </Link>
    </Site>, async () => <Site responsive={false} navbar={false}>
      <div className="md:sticky inset-0 w-full">
        <TopBar/>
        <EmmausBranding/>
      </div>
      <div className="relative z-10 bg-back">
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
    </Site>
  )();
}
