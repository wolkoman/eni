'use client'

import Image from "next/image";
import Link from "next/link";
import Site from "../components/Site";

export default function Error({error}: { error: Error & { digest?: string }, reset: () => void }) {
    return (
        <Site title="Seite nicht gefunden" footer={false}>
            <div className="h-full grow flex items-center justify-center">
                <div className="flex gap-6 items-center">
                    <Image src="/icons/icon_not_found.svg" alt="Trauriges Smiley" width={100} height={100}/>
                    <div className="flex flex-col gap-1">
                        <div className="font-bold text-lg">Unerwarteter Fehler</div>
                        <div>{error.name}: {error.message}</div>
                        <div style={{fontFamily: "monospace"}} className="text-sm">{error.stack}</div>
                    </div>
                </div>

            </div>
        </Site>
    )
}
