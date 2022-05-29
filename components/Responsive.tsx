import React from 'react';

export default function Responsive({children, narrow = false, className = "" }: {children: any, narrow?: boolean, className?: string}){
  return <div className={`${narrow ? "md:max-w-xl" : "md:max-w-5xl"} mx-auto px-4 ${className}`}>
    {children}
  </div>
}