import React from 'react';
import Lottie from 'react-lottie-player'
import {CalendarName, getCalendarInfo} from '../util/calendar-info';
import {site} from "../util/sites";
import Responsive from './Responsive';
import eniAnimation from "../public/eni_animation.json";

export function EniBranding() {

    return <div className="overflow-hidden"><Responsive>
        <div className="md:pt-12 relative">
            <div className="text-6xl font-bold pt-16 text-center z-10 relative">
                <div className="relative">
                    {site('Eine Neue Initiative', 'emmaus am wienerberg')}
                    <div className="absolute inset-0 text-stroke">
                        {site('Eine Neue Initiative', 'emmaus am wienerberg')}
                    </div>
                </div>
            </div>
            <div className="text-xl pb-16 text-center z-10 relative">
                Drei katholische Pfarren im Dekanat 23, Wien
                <div className="absolute inset-0 text-stroke-sm">
                    Drei katholische Pfarren im Dekanat 23, Wien
                </div>
            </div>
            <Lottie
                animationData={eniAnimation}
                play
                
                loop={false}
                className="absolute top-24 md:top-16 scale-[450%] md:scale-[200%]"
            >
            </Lottie>
            <div className="flex flex-col md:flex-row justify-center md:space-x-4 relative">
                {[CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT]
                    .map(calendar => getCalendarInfo(calendar))
                    .map((calendar, index) =>
                        <div key={calendar.image}
                             style={{animationDelay: (0.25+index* 0.25) + "s"}}
                             className={`rounded-xl md:w-64 flex flex-row md:flex-col bg-white border-8 border-white z-10 animate-wiggle`}>
                            <div className={`${calendar.className} flex-shrink-0 rounded-lg w-32 md:w-auto`}>
                                <div
                                    className="flex justify-center items-end from-white to-transparent bg-gradient-to-l sm:bg-gradient-to-t w-full h-full">
                                    <img src={calendar.image} className="sm:h-36 sm:w-auto"
                                         alt={calendar.fullName}/>
                                </div>
                            </div>
                            <div className="p-4 m:p-6 flex flex-col justify-center">
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