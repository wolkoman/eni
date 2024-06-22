import Link from 'next/link'
import Site from "../components/Site";
import Image from "next/image";

export default function NotFound() {
  return <Site title="Seite nicht gefunden" footer={false}>
    <div className="h-full grow flex items-center justify-center py-12">
      <div className="flex gap-6 items-center">
        <Image src="/icons/icon_not_found.svg" alt="Trauriges Smiley" width={100} height={100}/>
        <div className="flex flex-col gap-1">
          <div className="font-bold text-lg">Seite nicht gefunden</div>
          <Link href="/" className="underline hover:no-underline">zurück zur Startseite</Link>
        </div>
      </div>

    </div>
  </Site>
}
