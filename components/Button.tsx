import React from 'react';

export default function Button(props: {label: string, onClick?: () => any, secondary?: boolean, disabled?: boolean, className?: string}) {
  return <div className={`
      ${props.className ?? ''}
      inline-block px-3 py-1 rounded transform transition
      ${props.secondary ? 'border border-black/80 text-black/80' : 'bg-black/80 ring-emmaus text-white'}
      ${props.disabled ? 'pointer-events-none opacity-70 border-black/50'  : 'cursor-pointer hover:opacity-90'}
    `}
    onClick={props.onClick}>
    {props.label}
  </div>;
}
