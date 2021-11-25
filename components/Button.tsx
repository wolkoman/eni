import React from 'react';

export default function Button(props: {label: string, onClick?: () => any, secondary?: boolean, disabled?: boolean, className?: string}) {
  return <div className={`
      ${props.className ?? ''}
      font-sans inline-block px-3 py-1 text-white mt-2 rounded transform transition
      ${props.secondary ? 'bg-gray-500 ring-bg-gray-500' : 'bg-primary1 ring-primary1'}
      ${props.disabled ? 'pointer-events-none opacity-70' : 'cursor-pointer hover:scale-105 hover:bg-primary2'}
    `}
    onClick={props.onClick}>
    {props.label}
  </div>;
}
