"use client"

// @ts-ignore
import Aesthetically from "./../node_modules/aesthetically/aesthetically.js";
import React, {MouseEventHandler, useState} from "react";
import {AnimatePresence, motion} from 'framer-motion'

import {Clickable} from "../app/(shared)/Clickable";
import {SectionHeader} from "./SectionHeader";
import {CalendarInfo, CalendarName, getCalendarInfo} from "../app/termine/CalendarInfo";

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
  return <Clickable onClick={props.onClick}>
    <motion.div
      layoutId={props.item.id}
      style={{backgroundImage: `url(${props.item?.media_url})`}}
      className="bg-cover relative bg-center aspect-square rounded-lg"
    >
    </motion.div>
    <motion.div
      className="text-lg font-semibold py-3 px-6 rounded-t-lg ">
      <motion.div layoutId={props.item.id + "title"}>{props.item?.title}</motion.div>
    </motion.div>
  </Clickable>;
}

function InstagramScreen({item, close}: { item: InstagramFeedItem, close: () => void }) {
  return <div className="fixed inset-0 flex items-center justify-center z-30">
    <motion.div
      className="absolute inset-0 bg-black/10 max-h-screen"
      onClick={close}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
    />
    <motion.div
      initial={{opacity: 0, scale: 0.8}}
      animate={{opacity: 1, scale: 1}}
      exit={{opacity: 0, scale: 0.8}}
      className="flex flex-col justify-end lg:justify-center items-center z-50"
    >
      <motion.div
        className="grid lg:grid-cols-2 p-4 bg-white max-w-6xl lg:rounded-xl">
        <motion.div
          layoutId={item.id}
          style={{backgroundImage: `url(${item?.media_url})`}}
          className="max-w-full rounded-lg aspect-square bg-cover bg-center"
        />
        <div className="p-4 flex flex-col gap-4">
          <motion.div className="text-3xl font-bold" layoutId={item.id + "title"}>{item.title}</motion.div>
          <div className="flex gap-4">
            <div className="px-3 bg-black/5 rounded-lg">
              {new Date(item?.timestamp ?? 0).toLocaleDateString("de-AT")}
            </div>
            {item.calendar &&
                <div className={"px-3 rounded-lg " + (item.calendar?.className)}>
                    Pfarre {item.calendar?.shortName}
                </div>}
          </div>
          <div className="max-h-32 lg:max-h-80">{item.caption}</div>
        </div>
        <div className="flex justify-end">
          <img
            src="/logo/close.svg" className="w-16 bg-white rounded-xl mt-4 cursor-pointer lg:hidden"
            onClick={close}
          />
        </div>
      </motion.div>
      <motion.img
        src="/logo/close.svg" className="w-16 bg-white rounded-xl mt-4 cursor-pointer hidden lg:block"
        onClick={close}
        initial={{translateY: -20}}
        animate={{translateY: 0}}
        exit={{translateY: -20}}
      />
    </motion.div>
  </div>;
}

export function Instagram(props: { items: InstagramFeedItem[] }) {
  const feed = props.items.slice(0, 6).map(item => ({
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

  return <div className="my-8">
    <SectionHeader id="einblick">Einblick ins Pfarrleben</SectionHeader>
    <AnimatePresence>{item && <InstagramScreen item={item} close={() => setItem(null)}/>}</AnimatePresence>
    <div className="grid lg:grid-cols-2 gap-8">
      {feed.map((item, index) =>
        <InstagramItem key={index} item={item} onClick={item ? () => setItem(item) : () => {
        }}/>)}
    </div>
  </div>;
}
