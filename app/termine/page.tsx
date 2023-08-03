import React from 'react';
import EventPage from "./EventPage";
import {getLiturgyDataTill} from "../../pages/api/liturgy";
import {GetEventPermission} from "./EventMapper";
import {loadEvents} from "./EventsLoader";

export const revalidate = 300

export default async function () {
  const liturgy = await getLiturgyDataTill(new Date(new Date().getTime() + 1000 * 3600 * 24 * 180))
  const eventsObject = await loadEvents({permission: GetEventPermission.PUBLIC})
  return <EventPage liturgy={liturgy} eventsObject={eventsObject}/>
}

