import React from 'react';
import Lottie from 'react-lottie-player'
import Responsive from './Responsive';
import eniAnimation from "../public/eni_animation.json";

export function EniBranding() {

    return <div className="overflow-hidden h-[480px] lg:h-[560px] "><Responsive>
        <div className="lg:ml-12 mt-12 flex flex-col lg:flex-row items-center lg:gap-8 justify-center">
            <div>Pfarre Emmaus am Wienerberg</div>
            <div>Pfarre Inzersdorf (St. Nikolaus)</div>
            <div>Pfarre Inzersdorf-Neustift</div>
        </div>
        <div className="relative">
            <div className="pt-24 lg:pt-32 text-center z-10 relative font-bold">
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
                className="absolute top-16 lg:top-16 -left-24 h-96 scale-[350%] lg:scale-[150%] z-0"
            />

        </div>

    </Responsive></div>;
}