import React from 'react';
import {site, siteType, SiteType} from '../util/sites';
import Responsive from "./Responsive";
import {getCalendarInfo} from "../util/calendar-info";

export function TopBranding() {
    return <div className={getCalendarInfo("emmaus").className + " pt-24 mt-12 text-stroke"}>
        <Responsive>
            <div className="flex justify-around items-center">
                <div className="text-6xl font-bold self-start stroke-2 stroke-black">
                    Pfarre Emmaus<br/>am Wienerberg
                </div>
                <img className="self-end h-64" src={getCalendarInfo("emmaus").image}/>
            </div>
        </Responsive>
    </div>;
}