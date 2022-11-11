import React from 'react';
import Lottie from 'react-lottie-player'
import Responsive from './Responsive';
import eniAnimation from "../public/eni_animation.json";

export function EniBranding() {

    return <div className="overflow-hidden h-[600px] "><Responsive>
        <div className="ml-12 mt-12 flex items-center gap-3 justify-center">
            Pfarre Emmaus am Wienerberg
            <div className="mt-0.5 w-2 border-t border-black/60"/>
            Pfarre Inzersdorf (St. Nikolaus)
            <div className="mt-0.5 w-2 border-t border-black/60"/>
            Pfarre Inzersdorf-Neustift
        </div>
        <div className="relative">
            <div className="pt-32 text-center z-10 relative font-bold">
                <div className="relative text-7xl">
                    Eine Neue Initiative
                    <div className="absolute inset-0 text-stroke">
                        Eine Neue Initiative
                    </div>
                </div>

            </div>
            <div className="absolute -top-12 right-0 flex h-36 z-0 hidden">
                <img src="/parish/emmaus.svg" className=""/>
                <img src="/parish/inzersdorf.svg" className=""/>
                <img src="/parish/neustift.svg" className=""/>
            </div>
            <Lottie
                animationData={eniAnimation}
                play loop={false}
                className="absolute top-24 lg:top-16 -left-24 h-96 scale-[350%] lg:scale-[150%] z-0"
            />

        </div>

    </Responsive></div>;
}