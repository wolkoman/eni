import React from 'react';

export function SectionHeader(props: {children: React.ReactNode, id?: string}) {
  return <div id={props.id} className="text-3xl mt-8 mb-8 font-semibold">{props.children}</div>;
}