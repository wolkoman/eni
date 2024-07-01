import React from 'react';
import Site from "../../components/Site";
import {WeeklyContent} from "@/app/wochenmitteilungen/WeeklyContent";
import {loadWeeklyEvents} from "@/app/intern/wochenmitteilungen-editor/(events-page)/LoadWeeklyEvents";
import {WeeklyActions} from "@/app/wochenmitteilungen/WeeklyActions";
import {getCurrentWeeklyData} from "@/app/wochenmitteilungen/getCurrentWeeklyData";
import {loadCachedLiturgyData} from "../../pages/api/liturgy";
import {WeeklyEditorStoreData} from "@/app/intern/wochenmitteilungen-editor/store";

export const revalidate = 300

export default async function Page() {

  const weekly = await getCurrentWeeklyData();
  const events = await loadWeeklyEvents(weekly?.start, weekly?.end)
  const storeData: WeeklyEditorStoreData = {...weekly.data, events}
  const liturgy = await loadCachedLiturgyData()

  return (
    <Site title="Wochenmitteilungen">
      <div className="text-4xl font-bold my-6 lg:my-12 print:hidden">
        Wochenmitteilungen
      </div>
      <div className="max-w-xl my-6 print:hidden">
        Gottesdienste, Veranstaltungen und Ankündigungen werden jede Woche in den Wochenmitteilungen verlautbart. Um
        stets informiert zu bleiben, empfehlen wir den Newsletter zu abonnieren.
      </div>
      <WeeklyActions storeData={storeData} liturgy={liturgy}/>

      <div className="font-semibold my-4 print:hidden">
        Aktuelle Informationen ({weekly?.name}):
      </div>
      {weekly?.data && <WeeklyContent storeData={storeData}/>}
    </Site>
  );

}
