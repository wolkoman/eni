import {SectionHeader} from './SectionHeader';
import Responsive from "./Responsive";
// @ts-ignore
import Aesthetically from "./../node_modules/aesthetically/aesthetically.js";
import {CalendarInfo, CalendarName, getCalendarInfo} from "../util/calendar-info";
import Link from "next/link";
import {useState} from "react";

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

function InstagramBig(props: { item: any }) {
    return <div className="w-full rounded-lg bg-black/5">
        <div
            style={{backgroundImage: `url(${props.item?.media_url})`}}
            className={`bg-cover relative bg-center aspect-square rounded-lg`}>
        </div>
        <div className="p-4 lg:p-8 flex gap-4 lg:text-xl">
            <div className="inline-block px-3 bg-white font-bold rounded-lg">
                {props.item == null || new Date(props.item?.timestamp ?? 0).toLocaleDateString("de-AT")}
            </div>
            {props.item?.calendar &&
                <div className={"inline-block px-3 font-bold rounded-lg " + (props.item?.calendar?.className)}>
                    Pfarre {props.item?.calendar?.shortName}
                </div>}
        </div>
        <div className="text-xl lg:text-2xl p-4 lg:p-8 pt-0">
            {props.item?.text}
        </div>
    </div>;
}

export function Instagram(props: { items: any[] }) {
    const feed = props.items.slice(0, 5).map(item => ({...item,
        text: Aesthetically.unformat(item?.caption.normalize() ?? ''),
    })).map(item => ({...item,
        calendar: item.text.includes("Emmaus") ? getCalendarInfo(CalendarName.EMMAUS) : (item.text.includes("Nikolaus") ? getCalendarInfo(CalendarName.INZERSDORF) : (item.text.includes("Neustift") ? getCalendarInfo(CalendarName.NEUSTIFT) : null))
    }));
    const [activeIndex, setActiveIndex] = useState(0);
    return <div data-testid="instagram">
        <Responsive>
            <SectionHeader id="pfarrleben">Einblick ins Pfarrleben</SectionHeader>
            <div className="lg:hidden overflow-scroll -mx-4 snap-x snap-mandatory">
                <div className="flex">
                {
                    feed.map(item => <div className="shrink-0 p-4 -mx-2 w-full snap-center"><InstagramBig item={item}/></div>)
                }
                </div>

            </div>
            <div className="hidden lg:flex flex-row items-start gap-4">
                <InstagramBig item={feed[activeIndex]}/>
                <div className="hidden lg:flex flex-col flex-wrap gap-4">
                    {feed.length === 0 && Array(3).fill(0).map((_, index) =>
                        <InstagramSmall key={index}/>
                    )}
                    {feed
                        .filter(item => item.media_type !== 'VIDEO')
                        .slice(0, activeIndex)
                        .map((item, index) => <div onClick={() => setActiveIndex(index)}>
                            <InstagramSmall key={item.id} item={item}/>
                        </div>)}
                    {feed
                        .filter(item => item.media_type !== 'VIDEO')
                        .slice(activeIndex + 1)
                        .map((item, index) => <div onClick={() => setActiveIndex(index + activeIndex + 1)}>
                            <InstagramSmall key={item.id} item={item}/>
                        </div>)}
                    {feed.length > 0 &&
                        <a href="//instagram.com/eni.wien/">
                            <div
                                className="w-full py-8 text-xl text-center flex items-center justify-center bg-black/5 hover:bg-black/10 font-bold rounded-lg cursor-pointer">
                                Mehr auf Instagram
                            </div>
                        </a>}
                </div>
            </div>

        </Responsive>
    </div>;
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