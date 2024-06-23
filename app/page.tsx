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
      <div className="max-w-md mx-auto">

        <div className="font-bold my-4">
          Ende der Initiative &bdquo;Miteinander der Pfarren: eni.wien&ldquo;
        </div>
        <div className="">
          Die diözesane Vision die drei Pfarren Emmaus am Wienerberg, Inzersdorf (St. Nikolaus) und Inzersdorf-Neustift in
          eine größere Einheit zusammenzuführen konnte nicht umgesetzt werden. Für die Pfarre Emmaus am Wienerberg ist
          weiterhin Pfarrer Dr.&nbsp;Zvonko&nbsp;Brezovski tätig. Für die Pfarren Inzersdorf (St.&nbsp;Nikolaus) und
          Inzersdorf-Neustift
          wird ab 1. Juli 2024 Bernhard&nbsp;Pokorny als Pfarrprovisor tätig.
        </div>
        <Link className="flex items-center gap-3 my-4 underline decoration-black/20 hover:decoration-black/40 transition"
              href="https://data.eni.wien/storage/uploads/2024/06/22/2024-06-21_Information_Rucktritt_PfBrezovski_uid_667706075db6e.pdf">
          <PiArrowRight/>
          <div>Schreiben der Erzdiözese &bdquo;Pfarrerwechsel in Wien 23&ldquo;</div>
        </Link>

        <div className="flex flex-col gap-2">
          {[CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT]
            .map(calendar => getCalendarInfo(calendar))
            .map(calendar => <Link
              href={calendar.websiteUrl}
              key={calendar.id}
              className={"relative border border-black/10 rounded-lg bg-white shadow flex px-2 -z-10 overflow-hidden cursor-pointer " + calendar.className}
            >
              <div className={"absolute inset-0 -z-10 bg-gradient-to-r from-white/0 to-white/20 pointer-events-none"}/>
              <div style={{backgroundImage: `url(${calendar.image})`}}
                   className="bg-contain bg-bottom w-24 bg-no-repeat pointer-events-none"/>
              <div className="p-4 flex flex-col justify-center gap-2  pointer-events-none">
                <div className="font-bold">{calendar.fullName}</div>
                <div className="underline decoration border-black/20">{calendar.websiteDisplay}</div>
              </div>
            </Link>)
          }
        </div>

      </div>
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
