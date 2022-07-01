import React from 'react';
import {SectionHeader} from './SectionHeader';

export function Section(props: {children: React.ReactNode,  title?: string, id?: string}) {
  return <div className="my-12">
    <SectionHeader id={props.id}>{props.title}</SectionHeader>
    {props.children}
  </div>;
}