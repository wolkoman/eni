import React from 'react';
import Responsive from "./Responsive";
import {getCalendarInfo} from "../util/calendar-info";

export function EmmausBranding() {
    return <div className={"bg-emmaus/80 pt-8 md:pt-24 relative overflow-hidden"}>
        <Responsive>
            <div className="flex flex-col md:flex-row justify-around items-center">
                <div className="text-5xl md:text-7xl self-start text-black/90 text-shadow relative">
                    <span className="font-bold text-white">Pfarre Emmaus</span><br/>
                    <span className="text-black">am Wienerberg</span>
                </div>
                <img className="self-end md:h-96 relative" src={getCalendarInfo("emmaus").image}/>
            </div>
        </Responsive>
    </div>;
}