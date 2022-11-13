import React, {ReactNode} from "react";
import Link from "next/link";

export function InternButton({href, label, onClick, children}: { href?: string, label?: string, onClick?: () => any, children?: ReactNode }) {
    return <Link href={href ?? ''}>
        <div onClick={onClick}
             className="h-32 bg-black/5 rounded-xl flex flex-col justify-center items-center cursor-pointer text-xl font-bold hover:bg-black/10 ">
            {label}{children}
        </div>
    </Link>;
}