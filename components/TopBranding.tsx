import React from 'react';
import {site, siteType, SiteType} from '../util/sites';
import Responsive from "./Responsive";
import {getCalendarInfo} from "../util/calendar-info";

export function TopBranding() {
    return <div className={"from-primary1/60 to-transparent bg-gradient-to-t pt-24 md:mt-12 relative overflow-hidden"}>
        <Responsive>
            <div className="flex flex-col md:flex-row justify-around items-center">
                <img className="absolute scale-125 opacity-50 hidden" src="/emmaus_graphics.svg"/>
                <div className="text-7xl self-start text-black/90 text-shadow relative">
                    <span className="font-bold">Pfarre Emmaus</span><br/>
                    <span className="text-primary1">am Wienerberg</span>
                </div>
                <img className="self-end h-80 md:h-96 relative" src={getCalendarInfo("emmaus").image}/>
            </div>
        </Responsive>
    </div>;
}