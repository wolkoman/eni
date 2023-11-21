"use client"
import Link from "next/link";
import {Links} from "./(shared)/Links";
import {EniSection} from "@/app/(shared)/EniSection";
import {ParishButton} from "./(shared)/ParishButton";
import {SectionHeader} from "../components/SectionHeader";

export function EniSections() {
  return <>
    <SectionHeader>Von uns, für Sie</SectionHeader>
    <div className="grid lg:grid-cols-2 my-12 gap-24 lg:gap-12 text-center" id="wochenmitteilungen">
      <EniSection
        picture="/icons/icon_weekly.svg"
        title={<>Wochen&shy;mitteilungen</>}
        parish={info =>
          <Link href={Links.Wochenmitteilungen(info.id)} key={info.id}>
            <ParishButton info={info}/>
          </Link>
        }>
        Gottesdienste, Veranstaltungen und Ankündigungen jede Woche neu.
        Sie können sich auch gerne für den Newsletter registrieren: Schicken Sie dazu eine Mail mit
        der gewünschten Pfarre an kanzlei@eni.wien.
      </EniSection>
      <EniSection
        picture="/icons/icon_papers.svg"
        title={<>Pfarr&shy;zeitungen</>}
        parish={info =>
          <Link key={info.id} href={{
            emmaus: "https://emmaus.wien/#ueber-uns",
            inzersdorf: "https://www.pfarresanktnikolaus.at/wp/?page_id=89",
            neustift: "https://www.erzdioezese-wien.at/pages/pfarren/9233/pfarrblatt"
          }[info.id as 'emmaus']}>
            <ParishButton info={info}>{{
              emmaus: "Emmausbote",
              inzersdorf: "BLICKpunkt",
              neustift: "IN-News"
            }[info.id as 'emmaus']}
            </ParishButton>
          </Link>
        }>
        Ausführliche Berichte zum Pfarrleben, Diskussionen zur Weltkirche, Impulse zum Nachdenken
        und vieles mehr finden Sie in den Pfarrzeitungen der Pfarren.
      </EniSection>
      {false && <EniSection
        picture="/icons/icon_music.svg"
        title={<>Messen</>}
        parish={info => info.id === 'neustift' ? null :
          <Link key={info.id} href={{
            emmaus: "https://emmaus.wien/seite/emmaus-messe",
            inzersdorf: "https://emmaus.wien/seite/emmaus-messe",
          }[info.id as 'emmaus']}>
            <ParishButton info={info}>{{emmaus: "Emmaus Messe",inzersdorf: "Inzersdorf Messe",}[info.id as 'emmaus']}</ParishButton>
          </Link>
        }>
        Was wäre eine heilige Messe ohne Musik? Mehrere Personen aus unseren Pfarren haben zwei Gottesdienste getextet
        und komponiert.
      </EniSection>}
    </div>
  </>;
}

