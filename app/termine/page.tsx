import EventPage from "./EventPage";
import {loadCachedLiturgyData} from "../../pages/api/liturgy";
import {loadCachedEvents} from "@/domain/events/EventsLoader";
import {EventLoadAccess} from "@/domain/events/EventLoadOptions";
import {Suspense} from "react";

export const revalidate = 3600

export default async function () {
  const liturgy = await loadCachedLiturgyData()
  const eventsObject = await loadCachedEvents({access: EventLoadAccess.PUBLIC})
  return <Suspense fallback={"lädt..."}><EventPage liturgy={liturgy} eventsObject={eventsObject}/></Suspense>
}

