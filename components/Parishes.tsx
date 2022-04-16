import React from 'react';
import {Calendar} from '../util/calendar-events';
import {getCalendarInfo} from '../util/calendar-info';
import {site} from "../util/sites";

export function Parishes() {
    return <div className="py-12 mb-12">
        <div className="text-5xl font-bold text-center pt-12">
            {site('Emmaus Nikolaus Inzersdorf', 'emmaus am wienerberg')}
        </div>
        <div className="text-xl text-center pb-12">
            {site('drei katholische Pfarren im Dekanat 23, Wien', 'emmaus am wienerberg')}
        </div>
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
                            <div className="leading-5 text-center mt-2 italic md:text-left">{calendar.address}</div>
                            <a href={calendar.websiteUrl}>
                                <div
                                    className="leading-4 text-center mt-2 underline md:text-left">{calendar.websiteDisplay}</div>
                            </a>
                        </div>
                    </div>)}
        </div>
    </div>;
}