"use client"
import {Section} from "../components/Section";
import React, {useEffect, useState} from "react";
import {Field, SelfServiceInput} from "../components/SelfService";
import Button from "../components/Button";
import {fetchPrayers, submitPrayer} from "./prayer.server";
import {Collections} from "cockpit-sdk";
import {EniLoading} from "../components/Loading";


export function PrayerWall() {
  const emptyForm = {name: "", concern: ""}
  const form = useState(emptyForm)
  const [state, setState] = useState("")
  const [prayer, setPrayers] = useState<Collections['prayers'][]>()

  useEffect(() => {
    fetchPrayers().then(setPrayers)
  })

  async function submit() {
    setState("loading")
    await submitPrayer(form[0])
    setState("")
    form[1](emptyForm)
  }

  return <Section title="Gebetswand">
    <div className="">

      <div className="max-w-lg">
        <div>
          Schreiben Sie Ihr Anliegen an die virtuelle Gebetswand, dass auch andere dafür beten können (es ist 30 Tage öffentlich sichtbar).
          Oder beten Sie für die Anliegen der Gemeinde.
        </div>
        <Field label="Anliegen">
          <SelfServiceInput name="concern" input="textarea" form={form}/>
        </Field>
        <Field label="Name">
          <SelfServiceInput name="name" form={form} placeholder="Anonym"/>
        </Field>
        <div className={`my-8 flex flex justify-end font-bold ${state === "loading" ? 'animate-pulse' : ''}`}>
          <Button label="Absenden" big={true} onClick={submit} disabled={state === "loading"}/>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
      {prayer === null && <EniLoading/>}
      {prayer?.map(prayer => <div key={prayer._id} className="border-2 border-emmaus rounded-lg p-4">
        <div className="text-sm">{prayer.name} am {new Date(prayer._created*1000).toLocaleDateString()}</div>
        <div className="italic text-emmaus font-bold text-lg">{prayer.concern}</div>
        <div className="text-sm">{prayer.name} am {new Date(prayer._created*1000).toLocaleDateString()}</div>
      </div>)}
      </div>
    </div>
  </Section>;
}