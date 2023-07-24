"use client"

import React, {ReactNode, useState} from 'react';

export default function Button(props: {
  label: ReactNode,
  sure?: true,
  onClick?: () => any,
  secondary?: boolean,
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
    disabled ? 'pointer-events-none' : 'cursor-pointer',
    props.disabled ? 'opacity-70 border-black/50' : 'hover:bg-black/10 hover:text-black',
    sure ? 'bg-[#d00] hover:bg-[#c00] text-white scale-110 transition-all shadow-xl' : '',
    !props.loading && 'button-loading'
  ].join(" ")


  return <div className={`${props.className ?? ''} inline-block rounded-lg transform transition ${style}`}
    onMouseLeave={() => setSure(false)}
    onClick={props.sure ? (sure ? props.onClick : () => setSure(x => !x)) : props.onClick}>
    {props.label}
  </div>;
}
