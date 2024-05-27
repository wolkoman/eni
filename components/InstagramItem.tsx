import React from "react";

import {InstagramFeedItem} from "./InstagramFeedItem";

export function InstagramItem(props: { item: InstagramFeedItem }) {
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