import React from 'react';
import Site from "../../components/Site";
import {WeeklyContent} from "@/app/wochenmitteilungen/WeeklyContent";
import {loadWeeklyEvents} from "@/app/intern/wochenmitteilungen-editor/(events-page)/LoadWeeklyEvents";
import {WeeklyActions} from "@/app/wochenmitteilungen/WeeklyActions";
import {CalendarName} from "@/domain/events/CalendarInfo";
import {getCurrentWeeklyData} from "@/app/wochenmitteilungen/getCurrentWeeklyData";


export default async function Page(props: {searchParams: {parish?: string}}) {

  const weekly = await getCurrentWeeklyData();
  const events = await loadWeeklyEvents(weekly?.start, weekly?.end)
  const storeData = {...weekly.data, events}
  const parish = props.searchParams.parish as CalendarName;


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
      {weekly?.data && <WeeklyContent storeData={storeData} calendar={parish}/>}
    </Site>
  );

}
