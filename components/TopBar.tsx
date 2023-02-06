import Link from 'next/link';
import {site} from '../util/sites';
import React, {useEffect, useState} from 'react';
import {useAuthenticatedUserStore} from "../util/use-user-store";
import Responsive from "./Responsive";
import {useRive} from "@rive-app/react-canvas";

export default function TopBar() {
    const {user} = useAuthenticatedUserStore();
    const [isFrontpage, setIsFrontpage] = useState(false);
    useEffect(() => {
        setIsFrontpage(location.pathname === "/");
    }, [])
    return site(<div className="my-2 lg:my-10 overflow-hidden">
        <Responsive>
            <Link href={user ? "/intern" : "/"}>
            <div className="flex justify-between text-sm">
                    <div className="font-bold">
                        Miteinander der Pfarren Emmaus am Wienerberg,<br/>Inzersdorf (St. Nikolaus) und Inzersdorf-Neustift
                    </div>
                <div className="hidden lg:block">
                    <img src="/logo/dreipfarren.svg"/>
                </div>
            </div>
            </Link>
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

export function Hero() {
    const {RiveComponent} = useRive({
        src: '/hero.riv',
        autoplay: true,
    });
    return <div className="relative w-full aspect-[25/1]">
        <RiveComponent/>
    </div>;
}