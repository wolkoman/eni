import {useState} from "@/app/(shared)/use-state-util";
import React from "react";
import {Preference, usePreferenceStore} from "@/store/PreferenceStore";
import {PiGearBold, PiXBold} from "react-icons/pi";
import Button from "./Button";

function SettingsOption(props: { title: string, description: string, name: Preference }) {
  const [preference, setPreference] = usePreferenceStore(props.name);
  return <div className="flex items-start cursor-pointer select-none" onClick={() => setPreference(!preference)}>
    <input
      type="checkbox" className="mt-2 mr-4 pointer-events-none" checked={preference}
      onChange={() => {
      }}
    />
    <div>
      <div className="font-bold">{props.title}</div>
      <div className="text-sm">{props.description}</div>
    </div>
  </div>;
}

export function Settings() {
  const [open, setOpen] = useState(false);
  return <div className="relative">
    <Button
      className="z-40 relative h-full items-center flex"
      onClick={() => setOpen(x => !x)}
      label={open ? <PiXBold/> : <PiGearBold/>}
    />
    <div
      className={`absolute top-0 right-0 w-screen max-w-sm rounded-lg p-6 bg-white shadow flex flex-col gap-4 z-20 ${!open && "max-w-0 max-h-0 opacity-0 pointer-events-none"} overflow-hidden`}>
      <SettingsOption
        name={Preference.SeparateMass}
        title="Separate heilige Messen"
        description="Hl. Messen und Gottesdienste getrennt anzeigen"/>
      <SettingsOption
        name={Preference.MonthView}
        title="Monatsansicht (In-Entwicklung)"
        description="Eine Monatsansicht anstelle der Terminliste anzeigen"/>
    </div>
  </div>;
}
