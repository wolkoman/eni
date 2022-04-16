import React from 'react';
import {SectionHeader} from './SectionHeader';

export function Section(props: {children: React.ReactNode, title: string}) {
  return <div className="my-12">
    <SectionHeader>{props.title}</SectionHeader>
    {props.children}
  </div>;
}