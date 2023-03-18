import {ReactNode} from "react";
import Responsive from "./Responsive";

export function EniHero() {
    return <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url(/bg-grad-mobile.svg)] lg:bg-[url(/bg-grad.svg)] bg-center bg-cover animate-colorful"/>
        <Responsive>
        <div className="flex justify-between flex-col lg:flex-row lg:items-end relative">
            <div className="my-20 text-5xl leading-tight text-white lg:mb-36">
                Miteinander der Pfarren <span className="font-bold">Emmaus</span>,{" "}
                 <span className="font-bold">St.&nbsp;Nikolaus</span> und  <span className="font-bold">Neustift</span>
            </div>
            <div className="bg-[url(/logo/dreipfarren.svg)] bg-contain bg-no-repeat bg-bottom lg:w-[1300px] h-[150px] grow-0"/>
        </div>
    </Responsive></div>;
}