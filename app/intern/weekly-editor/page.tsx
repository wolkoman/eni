import Site from "../../../components/Site";
import {WeeklyEditor} from "./WeeklyEditor";
import {loadCachedLiturgyData} from "../../../pages/api/liturgy";

export default async function WeeklyEditorPage(){
  const liturgy = await loadCachedLiturgyData()
  return <Site title="Wochenmitteilungen Editor">
      <WeeklyEditor liturgy={liturgy}/>
  </Site>
}