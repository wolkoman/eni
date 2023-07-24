"use client"
import React, {useState} from "react";
import {submitPrayer} from "../prayer.server";
import {Field, SelfServiceInput} from "../../../../components/SelfService";
import Button from "../../../../components/Button";
import {useRouter} from "next/navigation";

export function AddPrayerForm() {
  const [state, setState] = useState("")
  const emptyForm = {name: "", concern: ""}
  const form = useState(emptyForm)
  const router = useRouter()

  async function onClick() {
    setState("loading")
    await submitPrayer(form[0])
    setState("")
    form[1](emptyForm)
    router.push("/#gebetswand")
  }

  return <div className="max-w-lg">

    <Field label="Anliegen">
      <SelfServiceInput name="concern" input="textarea" form={form}/>
    </Field>
    <Field label="Name">
      <SelfServiceInput name="name" form={form} placeholder="Anonym"/>
    </Field>
    <div className={`my-8 flex justify-end font-bold ${state === "loading" ? "animate-pulse" : ""}`}>
      <Button label="Absenden" big={true} onClick={onClick} disabled={state === "loading"}/>
    </div>
  </div>;
}
