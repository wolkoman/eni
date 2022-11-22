import React from 'react';

export default function Button(props: {label: string, onClick?: () => any, secondary?: boolean, disabled?: boolean, className?: string}) {
  return <div className={`
      ${props.className ?? ''}
      inline-block px-3 py-1 rounded-lg transform transition
      ${props.secondary ? 'border border-black/80 text-black/80' : 'bg-black/5'}
      ${props.disabled ? 'pointer-events-none opacity-70 border-black/50'  : 'cursor-pointer hover:bg-black/10'}
    `}
    onClick={props.onClick}>
    {props.label}
  </div>;
}
