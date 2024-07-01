"use client"
// @ts-ignore
import Aesthetically from "./../node_modules/aesthetically/aesthetically.js";
import React, {useState} from "react";
import Button from "./Button";
import {fetchInstagramFeed} from "@/app/(shared)/Instagram";
import {InstagramItem} from "./InstagramItem";
import useSWR from 'swr'

export function InstagramMore() {
  const {data, error, isLoading} = useSWR("instagram", () => fetchInstagramFeed())
  const items = isLoading || error ? [] : (data ?? [])
  const [length, setLength] = useState(3);
  const feed = items.slice(3, length).map(item => ({
    ...item,
    caption: Aesthetically.unformat(item?.caption.normalize() ?? ''),
  }));

  return <div>
    <div className="grid gap-4">
      {feed.map((item, index) =>
        <InstagramItem key={index} item={item}/>)}
    </div>
    {items.length > length && <div className="flex justify-end my-4">
        <Button label={<>Mehr</>} onClick={() => setLength(x => x + 3)}/>
    </div>}
  </div>;
}
