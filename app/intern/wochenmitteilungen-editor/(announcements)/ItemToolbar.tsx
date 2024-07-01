"use client"
import React from "react";
import {PiArrowsLeftRightBold, PiPencilBold} from "react-icons/pi";

export function ItemToolbar(props: { onEdit: () => void, onSwapSides: () => void }) {
  return <div className="absolute right-0 m-3 group-hover:flex hidden gap-2">
    <PiPencilBold className="cursor-pointer" onClick={props.onEdit}/>
    <PiArrowsLeftRightBold className="cursor-pointer" onClick={props.onSwapSides}/>
  </div>;
}

