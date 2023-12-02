import React from "react";
import Link from "next/link";
import {Collections} from "cockpit-sdk";

export function PrayerCard(props: { prayer: Collections['prayers'] }) {
  return <Link href={"/gebetswand/" + props.prayer._id}>
    <div className="border border-emmaus bg-emmaus/5 rounded-lg h-full overflow-hidden flex flex-col">
      <div className="px-6 py-2 flex flex-col gap-2 grow">
        <div className="flex justify-between gap-1 text-sm py-2">
          {props.prayer.name && <div className="">Von {props.prayer.name}</div>}
        </div>
        <div className="text-emmaus font-bold text-lg leading-6 line-clamp-3 grow">„{props.prayer.concern}“</div>
        <div className="flex justify-between gap-1 text-sm py-2">
          <div className="">{+props.prayer.prayedCount > 0 && <>Es wurde {props.prayer.prayedCount} Mal für dieses
              Anliegen gebetet.</>}</div>
          <div className="">{new Date(props.prayer._created * 1000).toLocaleDateString("de-AT")}</div>
        </div>
      </div>
      {props.prayer.publicPrayer && <div className="bg-emmaus/20 px-6 py-1 line-clamp-2">{props.prayer.publicPrayer}</div>}
    </div>
  </Link>;
}
