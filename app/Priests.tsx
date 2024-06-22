import {Section} from "@/components/Section";
import * as React from "react";

export function Priests() {
  return <Section id="personal" title="Unsere Priester">
    <div className="flex flex-col lg:flex-row-reverse gap-4 items-stretch">

      <div className="bg-white rounded-lg shadow border border-black/10 overflow-hidden flex-[3] flex flex-col lg:flex-row pt-8">
        <div className="flex flex-col items-center justify-center text-center grow">
          <div className="font-bold italic text-xl">Fürchte dich nicht,<br/>du hast Gnade bei Gott gefunden!</div>
          <div className="text-lg font-semibold mt-4">Pfarrer Dr. Zvonko Brezovski</div>
          <a className="underline" href="mailto:pfarrer@eni.wien">pfarrer@eni.wien</a>
        </div>
        <div style={{backgroundImage: `url(/personal/zvonko.png)`}}
             className="bg-cover aspect-square w-full lg:w-80"/>
      </div>
      <div className="flex-1 flex flex-col items-center text-center rounded-lg shadow border border-black/10 bg-white pt-8">
        <div className="grow flex flex-col justify-center">
          <div className="text-lg font-semibold">Gil Vicente Thomas</div>
          <div className="italic">Aushilfskaplan</div>
          <a className="underline" href="mailto:kaplan.e@eni.wien">kaplan.e@eni.wien</a>
        </div>
        <div className=" aspect-square w-1/2 lg:w-52 relative bg-[url(/personal/gil.png)] bg-cover"/>
      </div>
    </div>
  </Section>;
}
