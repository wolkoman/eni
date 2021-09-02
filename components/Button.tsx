import React from 'react';

export default function Button(props: {label: string, onClick?: () => any}) {
  return <div className="bg-primary1 font-sans inline-block px-3 py-1 cursor-pointer text-white hover:ring-2 ring-offset-2 ring-primary1" onClick={props.onClick}>
    {props.label}
  </div>;
}
