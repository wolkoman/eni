import React from 'react';

export function SectionHeader(props: {children: React.ReactNode}) {
  return <div className="text-xl text-center mt-8 mb-4 font-semibold">{props.children}</div>;
}