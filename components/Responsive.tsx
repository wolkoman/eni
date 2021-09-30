import React from 'react';

export default function Responsive({children, narrow = false }: {children: any, narrow?: boolean}){
  return <div className={`${narrow ? "md:max-w-xl" : "md:max-w-4xl"} mx-auto px-4`}>
    {children}
  </div>
}