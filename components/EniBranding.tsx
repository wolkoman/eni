"use client";
import React from 'react';
import Lottie from 'react-lottie-player'
import Responsive from './Responsive';
import eniAnimation from "../public/eni_animation.json";
import Link from "next/link";
import { CalendarName, getCalendarInfo } from "../util/calendar-info";
import { isChristmas } from '../util/isChristmas';

function ParishLink(props: { calendar: CalendarName }) {
    const calendar = getCalendarInfo(props.calendar);
    return <Link href={calendar.websiteUrl}>
        <div className={`cursor-pointer z-20 rounded-lg px-2 py-1 relative`}>
            {calendar.fullName}
            <div className={`absolute ${calendar.className} inset-0 px-2 py-1 rounded-lg opacity-0 hover:opacity-100`}>
                {calendar.fullName}
            </div>
        </div>
    </Link>;
}

export function EniBranding() {

    return <div className="overflow-hidden h-[480px] lg:h-[560px] "><Responsive>
        <div className="lg:ml-12 mt-12 flex flex-col lg:flex-row items-center lg:gap-4 justify-center">
            <ParishLink calendar={CalendarName.EMMAUS} />
            <ParishLink calendar={CalendarName.INZERSDORF} />
            <ParishLink calendar={CalendarName.NEUSTIFT} />
        </div>
        <div className="relative">
            <div className="pt-24 lg:pt-32 text-center z-10 relative font-bold">
                <div className="relative text-7xl">
                    {isChristmas() ? "Frohe Weihnachten" : "Eine Neue Initiative"}
                    <div className="absolute inset-0 text-stroke">
                        {isChristmas() ? "Frohe Weihnachten" : "Eine Neue Initiative"}
                    </div>
                </div>

            </div>
            <div className="absolute -top-12 right-0 flex h-36 z-0 hidden">
                <img src="/parish/emmaus.svg"/>
                <img src="/parish/inzersdorf.svg"/>
                <img src="/parish/neustift.svg"/>
            </div>
            <Lottie
                animationData={eniAnimation}
                play loop={false}
                className="absolute top-16 lg:top-16 -left-24 h-96 scale-[350%] lg:scale-[150%] z-0"
            />

        </div>

    </Responsive></div>;
}