"use client"

import React, {ReactNode, useState} from 'react';
import {RiLoader4Fill} from "react-icons/ri";

export default function Button(props: {
  label: ReactNode,
  sure?: true,
  onClick?: () => any,
  secondary?: boolean,
  icon?: ReactNode
  disabled?: boolean,
  loading?: boolean,
  big?: boolean,
  className?: string
}) {
    const [sure, setSure] = useState(false);
    const disabled = props.disabled || props.loading

  const style = [
    props.big ? 'px-8 py-3 text-lg ' : 'px-3 py-1',
    props.secondary ? 'border border-black/20 text-black/80 hover:bg-black/10' : 'bg-black/5',
    disabled ? 'opacity-70 border-black/50 pointer-events-none' : 'hover:bg-black/10 hover:text-black cursor-pointer',
    sure ? 'bg-[#d00] hover:bg-[#c00] text-white scale-110 transition-all shadow-xl' : '',
  ].join(" ")


  return <div
    className={`${style} ${props.className ?? ''} inline-flex items-center justify-center gap-1 rounded transition font-semibold`}
    onMouseLeave={() => setSure(false)}
    onClick={props.sure ? (sure ? props.onClick : () => setSure(x => !x)) : props.onClick}>
    {props.loading ? <RiLoader4Fill className="animate-spin"/> : props.icon} {props.label}
  </div>;
}
