import {useRive, useStateMachineInput} from "@rive-app/react-canvas";
import {useState} from "@/app/(shared)/use-state-util";
import React, {useEffect} from "react";
import {Preference, usePreferenceStore} from "@/store/PreferenceStore";

function SettingsOption(props: { title: string, description: string, name: Preference }) {
    const [preference, setPreference] = usePreferenceStore(props.name);
    return <div className="flex items-start cursor-pointer select-none" onClick={() => setPreference(!preference)}>
        <input
            type="checkbox" className="mt-2 mr-4 pointer-events-none" checked={preference}
            onChange={() => {}}
        />
        <div>
            <div className="font-bold">{props.title}</div>
            <div className="text-sm">{props.description}</div>
        </div>
    </div>;
}

export function Settings() {
    const {rive, RiveComponent} = useRive({
        src: '/settings.riv',
        autoplay: true,
        artboard: "settings",
        stateMachines: "state"
    });
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (hoverInput) hoverInput!.value = open
    }, [open]);
    const hoverInput = useStateMachineInput(rive, "state", "hover");
    return <div className="p-3 rounded-lg bg-black/5 relative">
        <div className="w-6 h-6 relative z-30 opacity-70 cursor-pointer" onClick={() => setOpen(value => !value)}>
            <RiveComponent/>
        </div>
        <div
            className={`absolute top-0 right-0 w-screen max-w-sm rounded-lg p-6 bg-[#f5f5f5] flex flex-col gap-4 z-20 ${!open && "max-w-0 max-h-0 opacity-0 pointer-events-none"} transition-all overflow-hidden`}>
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
