import React from 'react';
import Responsive from './Responsive';
import {useRive} from "@rive-app/react-canvas";

export function EniBranding() {
    return <div className="lg:my-10 overflow-hidden">
        <Responsive>
        <div className="flex justify-between text-sm">
            <div className=" font-bold">
                Zusammenarbeit der Pfarren Emmaus am Wienerberg, Inzersdorf (St. Nikolaus) und Inzersdorf-Neustift
            </div>
            <div className="hidden lg:block">
                kanzlei@eni.wien
            </div>
        </div>
        <div className="relative -mx-16">
            <Hero/>
        </div>
    </Responsive>
    </div>;
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