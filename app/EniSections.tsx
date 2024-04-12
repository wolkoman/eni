"use client"
import Link from "next/link";
import {EniSection} from "@/app/(shared)/EniSection";
import {ParishButton} from "./(shared)/ParishButton";
import {SectionHeader} from "../components/SectionHeader";
import Button from "../components/Button";
import {PiFileFill} from "react-icons/pi";

export function EniSections() {
  return <>
    <SectionHeader id="pfarrzeitschriften">Von uns, für Sie</SectionHeader>
    <div className="grid lg:grid-cols-2 my-4 gap-12 lg:gap-12 text-center" id="wochenmitteilungen">

      <EniSection
        picture="/icons/icon_papers.svg"
        title={<>Pfarr&shy;zeitschriften</>}
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
        und vieles mehr finden Sie in den Pfarrzeitschriften der Pfarren.
      </EniSection>
      <EniSection
        picture="/icons/icon_music.svg"
        title="Messen"
      >
        Die für unsere Pfarren komponierten Messvertonungen mit ihren berührenden Texten und Melodien ermöglichen eine frohe Liturgiefeier.
        <Link href="https://data.eni.wien/storage/uploads/2024/04/12/Emmausmesse_final_uid_66191e43633f0.pdf"
              className="mt-3">
          <Button label="Mess-Folder" icon={PiFileFill}/>
        </Link>
      </EniSection>
    </div>
  </>;
}

