import {fetchPrayer} from "../prayer.server";
import Site from "../../../../components/Site";
import {SectionHeader} from "../../../../components/SectionHeader";
import {PrayerSite} from "./PrayerSite";
import {Metadata} from 'next'

export async function generateMetadata({params}: any): Promise<Metadata> {
  const prayer = await fetchPrayer(params.id)
  return {
    title: `Gebet: ${prayer.concern}`
  }
}


export default async function Prayer({params}: { params: { id: string } }) {
  const prayer = await fetchPrayer(params.id)

  return <Site>
    <div className="my-4 max-w-lg mx-auto w-full">
      <SectionHeader>Gebetsanliegen</SectionHeader>
      <PrayerSite prayer={prayer}/>
    </div>
  </Site>
}
