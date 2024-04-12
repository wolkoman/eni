import React from 'react';
import Site from "../../components/Site";
import {cockpit} from "@/util/cockpit-sdk";
import {WeeklyContent} from "@/app/wochenmitteilungen/WeeklyContent";
import {loadWeeklyEvents} from "@/app/intern/weekly-editor/(events-page)/LoadWeeklyEvents";
import {WeeklyActions} from "@/app/wochenmitteilungen/WeeklyActions";


export default async function Page() {

  const weeklies = await cockpit.collectionGet("weekly_v2").then(response => response.entries)
  const weekly = weeklies
    .filter(weekly => new Date(weekly.end) > new Date() && new Date() > new Date(weekly.start))
    .sort((a, b) => b._modified - a._modified)?.[0]
  const events = await loadWeeklyEvents(weekly?.start, weekly?.end)
  const storeData = {...weekly.data, events}


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
      <WeeklyActions storeData={storeData}/>
      {weekly?.data && <WeeklyContent storeData={storeData}/>}
    </Site>
  );

}
