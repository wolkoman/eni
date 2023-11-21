import {ReactNode} from "react";

export function SectionHeader(props: {children: ReactNode, id?: string}) {
  return <div id={props.id} className="text-3xl mt-8 mb-2 font-semibold">{props.children}</div>;
}