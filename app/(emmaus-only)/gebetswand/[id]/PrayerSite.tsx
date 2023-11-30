"use client"
import {Collections} from "cockpit-sdk";
import {useState} from "react";
import {DisplayField} from "../../../../components/SelfService";
import Link from "next/link";
import Button from "../../../../components/Button";
import {prayedFor} from "../prayer.server";
import {useRouter} from "next/navigation";
import {EniLoading} from "../../../../components/Loading";
import {motion} from 'framer-motion'
import {useUserStore} from "../../../(store)/UserStore";

export function PrayerSite(props: {
  prayer: Collections['prayers'],
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const user = useUserStore(state => state.user)

  async function onPrayed() {
    setLoading(true)
    await prayedFor(props.prayer._id)
    await router.push("/#gebetswand")
  }

  return <div className="relative">
    {loading && <ThanksSplash/>}
    <DisplayField label="Anliegen">
      {props.prayer.concern}
    </DisplayField>
    {props.prayer.name && <DisplayField label="Von">
      {props.prayer.name}
    </DisplayField>}
    <DisplayField label="Gebetet">
        {props.prayer.prayedCount} Mal
    </DisplayField>
    <DisplayField label="Gebetsvorschlag">
      <div className="bg-black/5 rounded-lg p-4 whitespace-pre-wrap">
        {props.prayer.suggestion}
      </div>
    </DisplayField>
    <div className="flex justify-end gap-2">
      <Link href="/#gebetswand"><Button label="Zurück"/></Link>
      <Button label="Ich habe dafür gebetet" className="bg-emmaus text-white" onClick={onPrayed} loading={loading}/>
    </div>
  </div>;
}

function ThanksSplash(){
  return <motion.div className="absolute inset-0 bg-white grid place-items-center z-10"
                     initial={{opacity: 0}}
                     animate={{opacity: 1}}>
    <motion.div className="text-3xl z-10" initial={{scale: 1.5}} animate={{scale:1}}>Vergelt's Gott!</motion.div>
    <motion.div className="absolute inset-0 grid place-items-center" initial={{scale: 0.5, opacity: 0}} animate={{scale:1, opacity: .4}} transition={{delay: 1}}><EniLoading/></motion.div>
  </motion.div>
}
