import {fetchEmmausbote} from "@/app/(shared)/Weekly";
import {SectionHeader} from "@/components/SectionHeader";
import {getCockpitResourceUrl} from "@/app/EmmausSections";
import Link from "next/link";
import * as React from "react";

export async function EmmausboteInfo() {
  const emmausbote = await fetchEmmausbote()
  const paper = emmausbote.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return <div>
    <SectionHeader>Pfarrmagazin</SectionHeader>
    <Link href={getCockpitResourceUrl(paper.file)}
          className="flex flex-row cursor-pointer border border-black/10 bg-white rounded-lg overflow-hidden">
      <div
        className="w-32 aspect-square flex-shrink-0"
        style={{
          backgroundImage: `url(${getCockpitResourceUrl(paper.preview.path)})`,
          backgroundSize: 'cover',
          backgroundPosition: '50% 50%',
          aspectRatio: "21/29"
        }}/>
      <div className="flex flex-col justify-center items-start gap-2 px-6 py-2">
        <div
          className="font-semibold text-xl line-clamp-3">
          Emmausbote {new Date(paper.date).toLocaleDateString("de-AT", {
          month: "long",
          year: "numeric"
        })}
        </div>
        <div className="px-1 text-sm rounded">
          Ausführliche Berichte zum Pfarrleben, Diskussionen zur
          Weltkirche, Impulse zum Nachdenken und vieles mehr finden Sie im Emmausboten.
        </div>
      </div>
    </Link>

  </div>;
}
