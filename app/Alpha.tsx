"use client"

import {SectionHeader} from "../components/SectionHeader";
import Link from "next/link";
import * as React from "react";
import {ReactNode, useRef, useState} from "react";

function S(props: {title: string, children: ReactNode}){
  return <div className="my-2">
    <div className="font-semibold">{props.title}</div>
    <div>{props.children}</div>
  </div>
}

export function Alpha() {

  const [play, setPlay] = useState(false)
  const [controls, setControls] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)

  return <div className="my-8">
    <SectionHeader>Alpha Kurs</SectionHeader>
    <div className="flex flex-col lg:flex-row">
      <div className="flex items-center relative">
        {!play && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        onClick={() => {
          ref.current?.play()
          setPlay(true);
          setTimeout(() => setControls(true), 5000)
        }}>
          <svg className="w-12 h-12 hover:scale-110 transition cursor-pointer" width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="40" fill="#333333" />
            <path d="M55 40L30 55V25L55 40Z" fill="#FFFFFF" />
          </svg>
        </div>}
        <video controls={controls} ref={ref}
               className={"rounded-lg overflow-hidden border border-black/20 aspect-video w-full relative " + (play ? "" : "opacity-50")}>
          <source src="https://data.eni.wien/storage/uploads/2024/03/14/eine_einladung-540p_uid_65f2d34882b3e.mp4"
                  type="video/mp4"/>
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="p-4">
        <div className="font-2xl font-semibold">Machen Sie mit!</div>
        <S title="Abendeinheiten (19:00-21:30 Uhr, mit Abendessen)">
          9., 16., 23. und 30. April, der 7., 14., 21. und 28. Mai,
          sowie der 11. und 18. Juni 2024
        </S>
        <S title="Tageseinheit (ganzer Tag)">8. Juni 2024</S>
        <S title="Teilnahme">kostenlos, aber Anmeldung erforderlich</S>
        <S title="Anmeldung">
          Pastoralassistent Pedro
          Widler und sein Team werden den Alphakurs begleiten<br/>
          Infos und Anmeldung: E-Mail: <Link href="mailto:pass@eni.wien">pass@eni.wien</Link><br/>
          Telefon: 0676/559 33 48</S>
      </div>
    </div>
  </div>
}
