import React from 'react';

export default function Responsive({children, size = "md", className = "", sides = true }: {children: any, size?: 'md'|'sm'|'lg', className?: string, sides?: boolean }){
  return <div className={`${{sm: "md:max-w-xl", md:"md:max-w-5xl", lg:"md:max-w-7xl"}[size]} w-full mx-auto flex-grow flex flex-col ${sides && 'px-4'} ${className}`}>
    {children}
  </div>
}