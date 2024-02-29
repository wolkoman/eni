import Site from "../../../components/Site";
import {ClientPage} from "./ClientPage";
import {loadCachedLiturgyData} from "../../../pages/api/liturgy";

export default async function WeeklyEditorPage(){
  const liturgy = await loadCachedLiturgyData()
  return <Site title="Wochenmitteilungen Editor">
      <ClientPage liturgy={liturgy}/>
  </Site>
}