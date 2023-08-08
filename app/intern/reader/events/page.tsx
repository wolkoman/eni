import React from "react";
import {getLiturgyData} from "../../../../pages/api/liturgy";
import EventsPage from "./EventsPage";

const revalidate = 3600 * 24;

export default async function HomePage() {
  const liturgy = await getLiturgyData();
  return <EventsPage liturgy={liturgy}/>
}
