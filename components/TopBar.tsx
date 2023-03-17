import Link from 'next/link';
import {site} from '../util/sites';
import React, {useEffect, useState} from 'react';
import {useAuthenticatedUserStore} from "../util/use-user-store";
import Responsive from "./Responsive";

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
                <div className="flex justify-between items-center font-semibold gap-2 lg:gap-6">
                    <Link href="/termine">Termine</Link>
                    <Link href="/#wochenmitteilungen">Wochenmitteilungen</Link>
                   <Link href="/intern"> {user ? 'Intern' : 'Login'}</Link>
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