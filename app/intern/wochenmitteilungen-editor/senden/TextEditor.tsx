"use client"
import {Collections} from "cockpit-sdk";
import Site from "../../../../components/Site";
import {useState} from "react";
import {Field, SelfServiceInput} from "../../../../components/SelfService";
import Button from "../../../../components/Button";
import {PiGearBold, PiPaperPlaneBold} from "react-icons/pi";
import {generateWeeklyTextOnServer} from "@/app/intern/wochenmitteilungen-editor/senden/GenerateWeeklyTextOnServer";
import sendWeeklyNewsletter from "@/app/intern/wochenmitteilungen-editor/senden/SendMail";

export function TextEditor(props: {
  currentWeekly: Collections["weekly_v2"]
}) {
  const form = useState({emmaus: "", inzersdorf: "", neustift: "", evangelium: "", slogan: ""})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string|null>(null)

  function generateWeeklyText() {
    setLoading(true);
    generateWeeklyTextOnServer(props.currentWeekly)
      .then(text => form[1](text))
      .finally(() => setLoading(false))
  }

  function send() {
    setLoading(true);
    setMessage(null)
    sendWeeklyNewsletter(props.currentWeekly.name, form[0].slogan, form[0].evangelium, form[0])
      .then(value => setMessage((typeof value === 'number') ? `${value} Mails wurden versandt` : `${value}`))
      .finally(() => setLoading(false))
  }

  return <Site title="Wochenmitteilungen Versand">
    <div className="max-w-xl w-full mx-auto">
      <div>Wochenmitteilungen {props.currentWeekly.name}</div>
      <Field label="Betreff">
        <SelfServiceInput name="slogan" form={form}/>
      </Field>
      <Field label="Evangelium">
        <SelfServiceInput name="evangelium" form={form} input="textarea"/>
      </Field>
      <Field label="Text: Emmaus">
        <SelfServiceInput name="emmaus" form={form} input="textarea"/>
      </Field>
      <Field label="Text: Inzersdorf">
        <SelfServiceInput name="inzersdorf" form={form} input="textarea"/>
      </Field>
      <Field label="Text: Neustift">
        <SelfServiceInput name="neustift" form={form} input="textarea"/>
      </Field>

      <div className="flex gap-2">
        <Button label="Generieren" icon={PiGearBold} onClick={generateWeeklyText} loading={loading}/>
        <Button label="Senden" sure={true} icon={PiPaperPlaneBold} onClick={send} loading={loading}/>
      </div>
      {message && <div className="px-4 py-2 my-2 border border-black rounded">{message}</div>}
    </div>
  </Site>
}
