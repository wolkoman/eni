"use client"
import {Collections} from "cockpit-sdk";
import Site from "../../../../components/Site";
import {useState} from "react";
import {Field, SelfServiceInput} from "../../../../components/SelfService";
import Button from "../../../../components/Button";
import {PiGearBold} from "react-icons/pi";
import {generateWeeklyTextOnServer} from "@/app/intern/wochenmitteilungen-editor/senden/GenerateWeeklyTextOnServer";

export function TextEditor(props: {
  currentWeekly: Collections["weekly_v2"]
}) {
  const form = useState({emmaus: "", inzersdorf: "", neustift: "", evangelium: ""})
  const [loading, setLoading] = useState(false)

  function generateWeeklyText() {
    setLoading(true);
    generateWeeklyTextOnServer(props.currentWeekly)
      .then(text => form[1](text))
      .finally(() => setLoading(false))
  }

  return <Site title="Wochenmitteilungen Versand">
    <div className="max-w-xl w-full mx-auto">
      <div>Wochenmitteilungen {props.currentWeekly.name}</div>
      <Field label="Text: Allgemein">
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

      <div>
        <Button label="Generieren" icon={PiGearBold} onClick={generateWeeklyText} loading={loading}/>
      </div>
    </div>
  </Site>
}
