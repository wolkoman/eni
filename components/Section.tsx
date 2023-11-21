import {SectionHeader} from './SectionHeader';
import {ReactNode} from "react";

export function Section(props: {children: ReactNode,  title?: string, id?: string}) {
  return <div className="my-12">
    <SectionHeader id={props.id}>{props.title}</SectionHeader>
    {props.children}
  </div>;
}