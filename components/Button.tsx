import React, {useState} from 'react';

export default function Button(props: {label: string, sure?: true, onClick?: () => any, secondary?: boolean, disabled?: boolean, big?: boolean, className?: string}) {
    const [sure, setSure] = useState(false);
  return <div className={`
      ${props.className ?? ''}
      inline-block  rounded-lg transform transition
      ${props.big ? 'px-8 py-3 text-lg' : 'px-3 py-1'}
      ${props.secondary ? 'border border-black/80 text-black/80' : 'bg-black/5'}
      ${props.disabled ? 'pointer-events-none opacity-70 border-black/50'  : 'cursor-pointer hover:bg-black/10'}
      ${sure && 'bg-[#d00] hover:bg-[#c00] text-white scale-110 transition-all shadow-xl'}
    `}
    onMouseLeave={() => setSure(false)}
    onClick={props.sure ? (sure ? props.onClick : () => setSure(x => !x)) : props.onClick}>
    {props.label}
  </div>;
}
