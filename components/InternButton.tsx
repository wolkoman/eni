import React, {ReactNode} from "react";
import Link from "next/link";

export function InternButton({href, label, onClick, children}: { href?: string, label?: string, onClick?: () => any, children?: ReactNode }) {
    return <Link href={href ?? ''}>
        <div onClick={onClick}
             className="h-32 bg-white rounded-xl flex flex-col justify-center items-center text-lg cursor-pointer text-xl border-2 border-black/10 hover:bg-black/[3%] ">
            {label}{children}
        </div>
    </Link>;
}