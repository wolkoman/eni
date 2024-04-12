import React from 'react';
import Site from "../../components/Site";
import {cockpit} from "@/util/cockpit-sdk";
import {WeeklyContent} from "@/app/wochenmitteilungen/WeeklyContent";


export default async function Page() {

  const weeklies = await cockpit.collectionGet("weekly_v2").then(response => response.entries)
  const weekly = weeklies
    .filter(weekly => new Date(weekly.end) > new Date() && new Date() > new Date(weekly.start))
    .sort((a, b) => a._modified - b._modified)?.[0]

  return (
    <Site title="Wochenmitteilungen">
      <div className="text-4xl font-bold my-6 lg:my-12 print:hidden">
        Wochenmitteilungen
      </div>
      <div className="max-w-xl my-6 print:hidden">
        Gottesdienste, Veranstaltungen und Ankündigungen jede Woche neu. Sie können sich auch gerne für
        den Newsletter registrieren: Schicken Sie dazu eine Mail mit der gewünschten Pfarre an
        kanzlei@eni.wien.
      </div>
      {weekly?.data && <WeeklyContent events={weekly.data.events} storeData={weekly.data}/>}
    </Site>
  );

}
