import React from 'react';
import {loadCachedEvents} from "@/domain/events/EventsLoader";
import {EventLoadAccess} from "@/domain/events/EventLoadOptions";
import {ComingUpInteractive} from "./ComingUpInteractive";

export async function ComingUp() {
  const eventsObject = await loadCachedEvents({access: EventLoadAccess.PUBLIC})
  return <ComingUpInteractive eventsObject={eventsObject}/>
}
