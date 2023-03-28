import Link from 'next/link';
import {site} from '../util/sites';
import React, {useEffect, useState} from 'react';
import {useAuthenticatedUserStore} from "../util/use-user-store";
import Responsive from "./Responsive";

function NavItem(props: {href: string, label: string}) {
    return <Link href={props.href}><div className="group relative px-2 py-1">
        {props.label}
        <div className="absolute inset-0 transition group-hover:bg-black/[3%] scale-75 group-hover:scale-100 rounded"/>
    </div></Link>;
}

export default function TopBar(props: { hidePicture?: boolean }) {
    const {user} = useAuthenticatedUserStore();
    const [isFrontpage, setIsFrontpage] = useState(false);
    useEffect(() => {
        setIsFrontpage(location.pathname === "/");
    }, [])
    return site(<div className="py-4 lg:py-6">
        <Responsive>
            <div className="flex justify-between items-center">
                <Link href="/">
                    <div className="font-bold text-xl">
                        eni.wien
                    </div>
                </Link>
                <div className="flex justify-between items-center font-semibold">
                    <NavItem href="/termine" label="Termine"/>
                    <NavItem href="/wochenmitteilungen" label="Wochenmitteilung"/>
                    <NavItem href="/intern" label={user ? 'Intern' : 'Login'}/>
                </div>
            </div>
        </Responsive>
    </div>, <div
        className={`flex flex-row justify-between py-4 px-10 lg:px-24 z-10 bg-emmaus text-white`} data-testid="navbar">
        <Link href={user ? "/intern" : "/"}>
            <div className="text-3xl cursor-pointer" data-testid="title">
                {isFrontpage ? <></> : <div className="flex space-x-4">
                    <div>Pfarre Emmaus</div>
                </div>}
            </div>
        </Link>
        <div className="flex flex-col justify-center items-center leading-4 hidden md:block opacity-80 text-right">
            <div className="text-md md:ml-24">kanzlei@eni.wien</div>
            <div className="text-md md:ml-24">{site("+43 664 886 32 680", "+43 1 616 34 00")}</div>
        </div>
    </div>);
}