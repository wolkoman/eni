import {cockpit} from "@/util/cockpit-sdk";

export async function getCurrentWeeklyData() {
  const weeklies = await cockpit.collectionGet("weekly_v2").then(response => response.entries)
  return weeklies
    //.filter(weekly => new Date(weekly.end) > new Date() && new Date() > new Date(weekly.start))
    .sort((a, b) => b._modified - a._modified)?.[0];
}
