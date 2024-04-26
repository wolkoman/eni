import {getCurrentWeeklyData} from "@/app/wochenmitteilungen/getCurrentWeeklyData";
import React from "react";
import {TextEditor} from "@/app/intern/wochenmitteilungen-editor/senden/TextEditor";


export default async function WeeklyEditorSendPage(){
  const currentWeekly = await getCurrentWeeklyData()
  return <TextEditor currentWeekly={currentWeekly}/>
}
