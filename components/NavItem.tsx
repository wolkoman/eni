import Link from "next/link";
import React from "react";

export function NavItem(props: { href: string, label: string }) {
    return <Link href={props.href}>
        <div className="group relative px-1 lg:px-2 py-1">
            {props.label}
            <div
                className="absolute inset-0 transition group-hover:bg-black/[3%] scale-75 group-hover:scale-100 rounded"/>
        </div>
    </Link>;
}