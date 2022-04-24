import React from 'react';
import {Calendar} from '../util/calendar-events';
import {getCalendarInfo} from '../util/calendar-info';
import {site} from "../util/sites";
import Responsive from './Responsive';

export function Parishes() {
    return <div className="overflow-hidden"><Responsive>
            <div className="py-12 mb-12 relative">
                <div className="text-6xl font-bold pt-16 text-center z-10 relative">
                    {site('Emmaus Nikolaus Inzersdorf', 'emmaus am wienerberg')}
                </div>
                <div className="text-xl pb-16 text-center z-10 relative">
                    {site('Drei katholische Pfarren im Dekanat 23, Wien', 'emmaus am wienerberg')}
                </div>
                <img src="/eni_graphics.svg"
                     className="absolute top-36 scale-[250%] lsg:scale-100 lg:top-24 left-28 opacity-40"/>
                <div className="flex flex-col md:flex-row justify-center md:space-x-4 relative">
                    {(['emmaus', 'inzersdorf', 'neustift'] as Calendar[])
                        .map(calendar => getCalendarInfo(calendar))
                        .map(calendar =>
                            <div key={calendar.image}
                                 className={`rounded-xl md:w-64 flex flex-row md:flex-col bg-white border-8 border-white z-10`}>
                                <div className={`${calendar.className} flex-shrink-0 rounded-lg w-32 md:w-auto`}>
                                    <div
                                        className="flex justify-center items-end from-white to-transparent bg-gradient-to-l sm:bg-gradient-to-t w-full h-full">
                                        <img src={calendar.image} className="sm:h-36 sm:w-auto"
                                             alt={calendar.fullName}/>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col justify-center">
                                    <div className="text-lg font-semibold leading-5">{calendar.fullName}</div>
                                    <div
                                        className="leading-5 text-center mt-2 italic md:text-left">{calendar.address}</div>
                                    <a href={calendar.websiteUrl}>
                                        <div
                                            className="leading-4 text-center mt-2 underline md:text-left">{calendar.websiteDisplay}</div>
                                    </a>
                                </div>
                            </div>)}
                </div>
            </div>
        </Responsive></div>;
}