"use client"

// @ts-ignore
import Aesthetically from "./../node_modules/aesthetically/aesthetically.js";
import React, {useState} from "react";
import {SectionHeader} from "./SectionHeader";
import {CalendarInfo, CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import Button from "./Button";

export interface InstagramFeedItem {
  id: string,
  media_type: 'CAROUSEL_ALBUM' | 'VIDEO' | 'IMAGE',
  media_url: string,
  title: string,
  permalink: string,
  timestamp: string,
  caption: string,
  text: string,
  calendar: CalendarInfo | null,
}

function InstagramItem(props: { item: InstagramFeedItem }) {
  return <div
    className="flex flex-col lg:flex-row items-start lg:items-stretch gap-2 border border-black/10 bg-white shadow rounded-lg overflow-hidden">
    {props.item.media_type == "VIDEO"
      ? <video className="w-full lg:w-80 aspect-square shrink-0" autoPlay controls muted loop>
        <source src={props.item.media_url}/>
      </video>
      : <div
        style={{backgroundImage: `url(${props.item?.media_url})`}}
        className="bg-cover relative bg-center w-full lg:w-80 aspect-square shrink-0"
      />}
    <div className="px-4 py-6 flex flex-col gap-2 grow">
      <div className="text-xl font-semibold">{props.item?.title}</div>
      <div className="grow">{props.item?.caption}</div>
      <div className="flex  items-end justify-end">
        <div className="px-3 py-1 opacity-50">
          {new Date(props.item?.timestamp ?? 0).toLocaleDateString("de-AT")}
        </div>
      </div>
    </div>
  </div>;
}

export function Instagram(props: { items: InstagramFeedItem[] }) {
  const [length, setLength] = useState(3);
  const feed = props.items.slice(0, length).map(item => ({
    ...item,
    caption: Aesthetically.unformat(item?.caption.normalize() ?? ''),
  })).map(item => ({
    ...item,
    calendar: item.caption.includes("Emmaus")
      ? getCalendarInfo(CalendarName.EMMAUS)
      : (item.caption.includes("Nikolaus")
        ? getCalendarInfo(CalendarName.INZERSDORF)
        : (item.caption.includes("Neustift")
            ? getCalendarInfo(CalendarName.NEUSTIFT)
            : null
        ))
  }));

  return feed.length === 0 ? <></> : <div className="my-8">
    <SectionHeader id="einblick">Einblick ins Pfarrleben</SectionHeader>
    <div className="grid gap-4" id="instagram-items">
      {feed.map((item, index) =>
        <InstagramItem key={index} item={item}/>)}
    </div>
    {props.items.length > length && <div className="flex justify-end my-4">
        <Button label={<>Mehr</>} onClick={() => setLength(x => x + 3)}/>
    </div>}
  </div>;
}
