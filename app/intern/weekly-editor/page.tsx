import Site from "../../../components/Site";
import {loadCachedLiturgyData} from "../../../pages/api/liturgy";
import dynamic from "next/dynamic";

const ClientPage = dynamic(() => import("./ClientPage"), {ssr: false})

export default async function WeeklyEditorPage(){
  const liturgy = await loadCachedLiturgyData()
  return <Site title="Wochenmitteilungen Editor" responsive={false}>
      <ClientPage liturgy={liturgy}/>
  </Site>
}