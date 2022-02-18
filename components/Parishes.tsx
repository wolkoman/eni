import React from 'react';
import {Calendar} from '../util/calendar-events';
import {getCalendarInfo} from '../util/calendar-info';
import {Section} from './Section';

export function Parishes() {
    return <Section title="Unsere Pfarren">
        <div className="py-6 pb-12 mt:py-12">
            <div className="grid sm:grid-cols-3 gap-4">
                {(['emmaus', 'inzersdorf', 'neustift'] as Calendar[])
                    .map(calendar => getCalendarInfo(calendar))
                    .map(calendar =>
                        <div key={calendar.image} className={`shadow rounded-lg overflow-hidden flex sm:flex-col bg-white`}>
                            <div className={`${calendar.className}`}>
                                <div
                                    className={`flex justify-center items-end from-white to-transparent bg-gradient-to-l sm:bg-gradient-to-t w-full`}>
                                    <img src={calendar.image} className="w-32 sm:h-48 sm:w-auto"
                                         alt={calendar.fullName}/>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col justify-center text-lg">
                                <div className="md:hidden leading-4 text-center font-semibold">{calendar.fullName}</div>
                                <div className="hidden md:block">{calendar.description(calendar.fullName)}</div>
                                <div className="leading-4 text-center mt-2 italic md:text-left">{calendar.address}</div>
                            </div>
                        </div>)}
            </div>
        </div>
    </Section>;
}