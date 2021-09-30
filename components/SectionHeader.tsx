import React from 'react';

export function SectionHeader(props: {children: React.ReactNode}) {
  return <div className="text-xl font-bold my-2">{props.children}</div>;
}