// @ts-ignore
import Aesthetically from "./../node_modules/aesthetically/aesthetically.js";
import React from "react";
import {SectionHeader} from "./SectionHeader";
import {fetchInstagramFeed} from "@/app/(shared)/Instagram";
import {InstagramItem} from "./InstagramItem";
import {InstagramMore} from "./InstagramMore";

export async function Instagram() {
  const items = await fetchInstagramFeed()
  const feed = items.slice(0, 3).map(item => ({
    ...item,
    caption: Aesthetically.unformat(item?.caption.normalize() ?? ''),
  }));

  return feed.length === 0 ? <></> : <div className="my-8">
    <SectionHeader id="einblick">Einblick ins Pfarrleben</SectionHeader>
    <div className="grid gap-4" id="instagram-items">
      {feed.map((item, index) =>
        <InstagramItem key={index} item={item}/>)}
    </div>
    <InstagramMore/>
  </div>;
}
