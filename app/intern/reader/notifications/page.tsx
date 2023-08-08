import React from "react";
import NotificationsPage from "./NotificationsPage";
import {getLiturgyData} from "../../../../pages/api/liturgy";

const revalidate = 3600 * 24;


export default async function HomePage() {
  const liturgy = await getLiturgyData();
  return <NotificationsPage liturgy={liturgy}/>
}
