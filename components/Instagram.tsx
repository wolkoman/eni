import {SectionHeader} from './SectionHeader';
import Responsive from "./Responsive";
// @ts-ignore
import Aesthetically from "./../node_modules/aesthetically/aesthetically.js";
import {CalendarInfo, CalendarName, getCalendarInfo} from "../util/calendar-info";
import React, {MouseEventHandler, useRef} from "react";

export interface InstagramFeedItem {
    id: string,
    media_type: 'CAROUSEL_ALBUM' | 'VIDEO' | 'IMAGE',
    media_url: string,
    permalink: string,
    timestamp: string,
    caption: string,
    text: string,
    calendar?: CalendarInfo,
}

function InstagramBig(props: { item: any, onClick: MouseEventHandler<HTMLDivElement> }) {
    return <div className="rounded-lg bg-black/5 max-w-lg lg:w-screen cursor-pointer" onClick={props.onClick}>
        <div
            style={{backgroundImage: `url(${props.item?.media_url})`}}
            className={`bg-cover relative bg-center aspect-square rounded-lg`}>
        </div>
        <div className="p-4 flex gap-4">
            <div className="inline-block px-3 bg-white font-bold rounded-lg">
                {props.item == null || new Date(props.item?.timestamp ?? 0).toLocaleDateString("de-AT")}
            </div>
            {props.item?.calendar &&
                <div className={"inline-block px-3 font-bold rounded-lg " + (props.item?.calendar?.className)}>
                    Pfarre {props.item?.calendar?.shortName}
                </div>}
        </div>
        <div className="text-xl p-4 pt-0">
            {props.item?.text}
        </div>
    </div>;
}

export function Instagram(props: { items: any[] }) {
    const feed = props.items.slice(0, 10).map(item => ({
        ...item,
        text: Aesthetically.unformat(item?.caption.normalize() ?? ''),
    })).map(item => ({
        ...item,
        calendar: item.text.includes("Emmaus")
            ? getCalendarInfo(CalendarName.EMMAUS)
            : (item.text.includes("Nikolaus")
                ? getCalendarInfo(CalendarName.INZERSDORF)
                : (item.text.includes("Neustift")
                        ? getCalendarInfo(CalendarName.NEUSTIFT)
                        : null
                ))
    }));
    const ref = useRef<HTMLElement>();
    const headerRef = useRef<HTMLElement>();
    return <>
        <Responsive>
            <div ref={headerRef as any}/>
            <SectionHeader id="pfarrleben">Einblick ins Pfarrleben</SectionHeader>
        </Responsive>
        <div className="overflow-auto snap-x snap-mandatory scroll-smooth" ref={ref as any}>
            <Responsive>
                <div className="flex">
                    {feed.map(item => <div className="shrink-0 p-4 -mx-2 w-full lg:w-auto snap-center">
                        <InstagramBig item={item} onClick={({target}) => {
                            const t = target as HTMLDivElement;
                            const x = t.getBoundingClientRect().left
                            const x2 = ref.current!.scrollLeft;
                            const x3 = headerRef.current!.getBoundingClientRect().left
                            ref.current!.scrollTo({left: x2+x-x3})
                        }}/>
                    </div>)}
                </div>
            </Responsive>
        </div>
    </>;
}

function InstagramSmall({item}: { item?: InstagramFeedItem }) {
    return <div
        style={{backgroundImage: `url(${item?.media_url})`}}
        className={`bg-cover bg-center ${item == null && 'shimmer'} aspect-square w-64 flex gap-2 items-end rounded-xl p-2 hover:opacity-90 cursor-pointer`}
    >
        <div className="inline-block px-1 bg-white font-bold rounded-lg">
            {item == null || new Date(item?.timestamp ?? 0).toLocaleDateString("de-AT")}
        </div>
        {item?.calendar && <div className={"inline-block px-1 font-bold rounded-lg " + (item?.calendar?.className)}>
            Pfarre {item?.calendar?.shortName}
        </div>}
    </div>;
}