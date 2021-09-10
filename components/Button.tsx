import React from 'react';

export default function Button(props: {label: string, onClick?: () => any, secondary?: boolean, className?: string}) {
  return <div className={`${props.className} font-sans inline-block px-3 py-1 cursor-pointer text-white hover:ring-2 ring-offset-2 ${props.secondary ? 'bg-gray-500 ring-bg-gray-500' : 'bg-primary1 ring-primary1'}`} onClick={props.onClick}>
    {props.label}
  </div>;
}
