import Link from "next/link";
import React from "react";

export function Navigation() {
    const Button = (props: { href: string, name: string }) => <Link href={`/${props.href}`} key={props.href}>
        <div className="p-4 cursor-pointer">
            {props.name}
        </div>
    </Link>;

    return <div
        className="sticky z-20 top-0 px-8 bg-emmaus/90 text-white text-lg hidden md:flex justify-between backdrop-blur-sm">
        <div className="flex justify-between p-4 font-bold">
            Pfarre Emmaus am Wienerberg
        </div>
        <div className="flex flex-wrap">
            <Button href="#aktuelles" name="Aktuelles"/>
            <Button href="#termine" name="Termine"/>
            <Button href="#pfarrleben" name="Pfarrleben"/>
            <Button href="#kontakt" name="Kontakt"/>
        </div>
    </div>;
}