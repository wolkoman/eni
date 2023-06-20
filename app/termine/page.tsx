import React from 'react';
import EventPage from "./EventPage";
import {getLiturgyDataTill} from "../../pages/api/liturgy";
import {getCachedEvents, GetEventPermission} from "../../util/calendar-events";

export const revalidate = 300

export default async function () {
  const liturgy = await getLiturgyDataTill(new Date(new Date().getTime() + 1000 * 3600 * 24 * 180))
  const eventsObject = await getCachedEvents({permission: GetEventPermission.PUBLIC})
  return <EventPage liturgy={liturgy} eventsObject={eventsObject}/>
}
