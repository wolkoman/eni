import EventPage from "./EventPage";
import {loadCachedLiturgyData} from "../../pages/api/liturgy";
import {loadCachedEvents} from "@/domain/events/EventsLoader";
import {EventLoadAccess} from "@/domain/events/EventLoadOptions";

export default async function () {
  const liturgy = await loadCachedLiturgyData()
  const eventsObject = await loadCachedEvents({access: EventLoadAccess.PUBLIC})
  return <EventPage liturgy={liturgy} eventsObject={eventsObject}/>
}

