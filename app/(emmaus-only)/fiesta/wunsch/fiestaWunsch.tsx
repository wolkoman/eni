"use client"
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {requestSong} from "@/app/(emmaus-only)/fiesta/wunsch/requestSong";


export function FiestaWunsch() {

  const [form, setForm] = useState({title: "", for: ""})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function send() {
    setLoading(true);
    await requestSong(form);
    router.push("/fiesta");
  }

  return <div className="bg-black min-h-[100vh] text-white">
    <div className="p-4 max-w-2xl mx-auto">
      <meta name="theme-color" content="black"/>

      <div className="text-2xl font-bold">Musikwunsch</div>

      <div className="my-6">
        <div>Musiktitel</div>
        <input
          disabled={loading}
          value={form.title}
          className="w-full bg-black border border-white rounded px-4 py-2 text-xl font-bold"
          onChange={event => setForm(f => ({...f, title: event.target.value}))}
        />
      </div>

      <div className="my-6">
        <div>Widmung</div>
        <textarea
          disabled={loading}
          value={form.for}
          className="w-full bg-black border border-white rounded px-4 py-2 text-xl font-bold"
          onChange={event => setForm(f => ({...f, for: event.target.value}))}
        />
      </div>
      <div className="flex justify-end">
        <div onClick={send}
             className="bg-emmaus-sec px-4 py-2 font-bold text-black rounded">{loading ? "lädt..." : "Abschicken"}</div>
      </div>

    </div>

  </div>;
}