import {site} from "@/app/(shared)/Instance";
import * as React from "react";
import {PiArrowRight} from "react-icons/pi";
import Link from "next/link";
import Site from "@/components/Site";
import {notFound} from "next/navigation";

export const revalidate = 300


export default async function HomePage() {

  if (site(false, true)) notFound();

  return <Site responsive={true} navbar={true}>
    <div className="font-bold my-4">
      Ende der Initiative &bdquo;Miteinander der Pfarren: eni.wien&ldquo;
    </div>
    <div className="max-w-md">
      Die diözesane Vision die drei Pfarren Emmaus am Wienerberg, Inzersdorf (St. Nikolaus) und Inzersdorf-Neustift in
      eine größere Einheit zusammenzuführen konnte nicht umgesetzt werden. Für die Pfarre Emmaus am Wienerberg ist
      weiterhin Pfarrer Dr.&nbsp;Zvonko&nbsp;Brezovski tätig. Für die Pfarren Inzersdorf (St.&nbsp;Nikolaus) und
      Inzersdorf-Neustift
      wird ab 1. Juli 2024 Bernhard&nbsp;Pokorny als Pfarrprovisor tätig.
    </div>
    <Link className="flex items-center gap-3 my-4 underline decoration-black/20 hover:decoration-black/40 transition"
          href="https://data.eni.wien/storage/uploads/2024/06/22/2024-06-21_Information_Rucktritt_PfBrezovski_uid_667706075db6e.pdf">
      <PiArrowRight/>
      <div>Schreiben der Erzdiözese &bdquo;Pfarrerwechsel in Wien 23&ldquo;</div>
    </Link>
  </Site>;
}
