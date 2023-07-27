import React, {ReactNode} from "react";
import Link from "next/link";
import {clickable} from "./calendar/ComingUp";

export function InternButton({href, label, onClick, children}: { href?: string, label?: string, onClick?: () => any, children?: ReactNode }) {
    return <Link href={href ?? ''}>
        <div onClick={onClick}
             className={`h-32 rounded-xl flex flex-col justify-center items-center text-center text-xl font-bold ${clickable}`}>
            {label}{children}
        </div>
    </Link>;
}