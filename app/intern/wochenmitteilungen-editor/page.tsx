import Site from "../../../components/Site";
import {loadCachedLiturgyData} from "../../../pages/api/liturgy";
import dynamic from "next/dynamic";
import {getCurrentWeeklyData} from "@/app/wochenmitteilungen/getCurrentWeeklyData";

const ClientPage = dynamic(() => import("./ClientPage"), {ssr: false})

export default async function WeeklyEditorPage(){
  const liturgy = await loadCachedLiturgyData()
  const currentWeekly = await getCurrentWeeklyData()
  return <Site title="Wochenmitteilungen Editor" responsive={false}>
      <ClientPage liturgy={liturgy} currentWeekly={currentWeekly}/>
  </Site>
}
