import React from 'react';

export default function Responsive({children, narrow = false, className = "", sides = true }: {children: any, narrow?: boolean, className?: string, sides?: boolean }){
  return <div className={`${narrow ? "md:max-w-xl" : "md:max-w-5xl"} w-full mx-auto flex-grow flex flex-col ${sides && 'px-2'} ${className}`}>
    {children}
  </div>
}