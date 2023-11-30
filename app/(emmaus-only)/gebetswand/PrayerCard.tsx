import React from "react";
import Link from "next/link";
import {Collections} from "cockpit-sdk";

export function PrayerCard(props: { prayer: Collections['prayers'] }) {
  return <Link href={"/gebetswand/" + props.prayer._id}>
    <div className="border-2 border-emmaus rounded-lg p-4">
      <div className="text-emmaus font-bold text-lg leading-5 line-clamp-3">„{props.prayer.concern}“</div>
      <div className="flex justify-between gap-1 mt-2 text-sm">
        <div className="">{new Date(props.prayer._created * 1000).toLocaleDateString("de-AT")}</div>
        <div className="line-clamp-1">{props.prayer.name}</div>
        <div className="">{+props.prayer.prayedCount > 0 && <>{props.prayer.prayedCount} Mal gebetet</>}</div>
      </div>
    </div>
  </Link>;
}