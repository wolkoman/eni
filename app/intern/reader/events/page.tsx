import {loadAndSaveLiturgyData, loadCachedLiturgyData} from "../../../../pages/api/liturgy";
import EventsPage from "./EventsPage";

export default async function HomePage() {
  const liturgy = await loadCachedLiturgyData();
  return <EventsPage liturgy={liturgy}/>
}
