"use client"
import {Section} from "../../../components/Section";
import React, {useEffect, useState} from "react";
import Button from "../../../components/Button";
import {fetchPrayers} from "./prayer.server";
import {Collections} from "cockpit-sdk";
import {EniLoading} from "../../../components/Loading";
import {PrayerCard} from "./PrayerCard";
import Link from "next/link";


export function PrayerWall() {
  const [prayer, setPrayers] = useState<Collections['prayers'][]>()

  useEffect(() => {
    fetchPrayers().then(setPrayers)
  }, [])

  return <Section title="Gebetswand" id="gebetswand">
    <div>
      Schreiben Sie Ihr Anliegen an die virtuelle Gebetswand, dass auch andere dafür beten können.
      Oder beten Sie für ein Anliegen der Gemeinde.
    </div>
    <div className="">
      {prayer === undefined && <EniLoading/>}
      <div className="grid lg:grid-cols-2 gap-4 my-4">
        {prayer?.map(prayer =>
          <PrayerCard key={prayer._id} prayer={prayer}/>
        )}
      </div>
    </div>
    <div className="flex justify-end gap-2">
      <Link href="/gebetswand/neu">
        <Button label="Anliegen einbringen"/>
      </Link>
    </div>
  </Section>;
}
