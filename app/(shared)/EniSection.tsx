import React, {ReactNode} from "react";
import {CalendarInfo, getCalendarInfo} from "@/domain/events/CalendarInfo";

export function EniSection(props: {
  title: ReactNode,
  children: ReactNode,
  picture: string,
  parish?: (info: CalendarInfo) => ReactNode | null
}) {
  return <div className="flex flex-col items-center">
    <img src={props.picture} className="h-44"/>
    <div className="text-3xl font-bold">
      {props.title}
    </div>
    <div className="text-lg my-3 grow text-center flex flex-col items-center">
      {props.children}
    </div>
    {props.parish && <div className="flex flex-col lg:flex-row gap-2">
      {["emmaus", "inzersdorf", "neustift"].map(id => getCalendarInfo(id as any)).map(props.parish)}
    </div>}
  </div>;
}