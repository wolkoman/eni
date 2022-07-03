import Link from "next/link";
import React from "react";

export function EmmausNavigation() {
    const Button = (props: { href: string, name: string }) => <Link href={`/${props.href}`} key={props.href}>
        <div className="p-4 cursor-pointer">
            {props.name}
        </div>
    </Link>;

    return <div
        className="sticky z-20 top-0 px-8 bg-emmaus text-white text-lg flex justify-between">
        <div className="flex justify-between p-4 font-bold hidden md:block">
            Pfarre Emmaus am Wienerberg
        </div>
        <div className="flex-wrap hidden md:flex">
            <Button href="#termine" name="Termine"/>
            <Button href="#pfarrzeitung" name="Pfarrzeitung"/>
            <Button href="#pfarrleben" name="Pfarrleben"/>
            <Button href="#kontakt" name="Kontakt"/>
        </div>
    </div>;
}