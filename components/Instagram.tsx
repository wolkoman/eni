"use client"

// @ts-ignore
import Aesthetically from "./../node_modules/aesthetically/aesthetically.js";
import React, {MouseEventHandler, useState} from "react";
import {SectionHeader} from "./SectionHeader";
import {CalendarInfo, CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";

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

function InstagramItem(props: { item: InstagramFeedItem, onClick: MouseEventHandler<HTMLElement> }) {
  return <div className="flex items-start lg:items-stretch gap-2 p-4 border border-black/20 rounded-lg">
    <div
      style={{backgroundImage: `url(${props.item?.media_url})`}}
      className="bg-cover relative bg-center w-24 lg:w-72 aspect-square rounded-lg shrink-0"
    />
    <div className="px-4 py-2 flex flex-col gap-2 grow">
      <div className="text-2xl font-bold">{props.item?.title}</div>
      <div className="grow">{props.item?.caption}</div>
      <div className="flex  items-end justify-end">
        <div className="px-3 py-1 bg-black/5 rounded-lg">
          {new Date(props.item?.timestamp ?? 0).toLocaleDateString("de-AT")}
        </div>
      </div>
    </div>
  </div>;
}

export function Instagram(props: { items: InstagramFeedItem[] }) {
  const feed = props.items.slice(0, 3).map(item => ({
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
  const [item, setItem] = useState<InstagramFeedItem | null>();

  return feed.length === 0 ? <></> : <div className="my-8">
    <SectionHeader id="einblick">Einblick ins Pfarrleben</SectionHeader>
    <div className="grid gap-8">
      {feed.map((item, index) =>
        <InstagramItem key={index} item={item} onClick={item ? () => setItem(item) : () => {
        }}/>)}
    </div>
  </div>;
}
