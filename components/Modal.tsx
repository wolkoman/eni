import React from 'react';
import Button from './Button';

export default function Modal(props: { content: any, button: any, title: string, loading?: boolean }) {
  return <>
    <div className="bg-black opacity-40 absolute top-0 left-0 w-full h-full z-20"/>
    <div className={`p-4 absolute top-0 left-0 w-full h-full z-20 flex justify-center items-center ${props.loading ? "pointer-events-none opacity-50" : ""}`}>
      <div className="bg-white p-4 max-w-4xl">
        <div className="font-bold pt-2 pb-4">{props.title}</div>
        <div>{props.content}</div>
        <div className="pt-4 flex justify-end">
          {props.button}
        </div>
      </div>
    </div>
    {props.content}
  </>;
}
