import {cockpit} from "@/util/cockpit-sdk";

export async function getCurrentWeeklyData() {
  return await cockpit.collectionGet("weekly_v2")
      .then(response => response.entries
          .sort((a, b) => b._modified - a._modified)?.[0]
      );
}
