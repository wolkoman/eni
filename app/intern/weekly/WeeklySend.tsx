"use client"

import {useState} from "../../(shared)/use-state-util";
import {fetchJson} from "../../(shared)/FetchJson";
import {toast} from "react-toastify";
import Button from "../../../components/Button";
import React from "react";

export function WeeklySend() {

    const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');
    const [message, setMessage] = useState("Liebe Pfarrgemeinde,\n\nwir übersenden Ihnen den Link zu den aktuellen Wochenmitteilungen.\n\nMit freundlichen Grüßen,\nKarin Bauer");

    function load() {
        if (state !== 'idle') return;
        setState('loading');
        fetchJson("/api/weekly/send-mail", {json: {message}})
            .then(({errorMessage}) => {
                setState(errorMessage ? 'idle' : 'success');
                if (errorMessage) toast.error(errorMessage)
            })
            .catch(() => setState('idle'));
    }

    return <>
        <div className="text-3xl font-bold my-4 mt-10">Senden</div>
        <textarea onChange={({target}) => setMessage(target.value)} value={message}
                  className="block my-4 border border-black/30 px-2 py-1 rounded outline-none w-full h-48"/>
        <Button label="Senden" sure={true} disabled={state !== 'idle'} onClick={load}/>
        {state === 'success' && <div className="my-4 bg-black/5 p-4 rounded-lg">
            Die Mails wurden gesendet!
        </div>}
    </>;
}
