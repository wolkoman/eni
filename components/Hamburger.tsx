import React from "react";

export function Hamburger(props: {onClick?: () => any}) {
    return <div className="flex flex-col justify-center items-center md:hidden" onClick={props.onClick}>
        <div className="bg-black/70 h-1 w-8 mb-1.5 mt-2"/>
        <div className="bg-black/70 h-1 w-8 mb-1.5"/>
        <div className="bg-black/70 h-1 w-8 mb-1.5"/>
    </div>;
}