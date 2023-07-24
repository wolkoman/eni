import React from "react";
import {fetchPrayers} from "./prayer.server";

export const revalidate = 3000;

export default async function PrayerPage() {
  const prayers = await fetchPrayers()
}
