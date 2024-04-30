import React, {ReactNode} from "react";
import {CalendarInfo, getCalendarInfo} from "@/domain/events/CalendarInfo";

export function EniSection(props: {
  title: ReactNode,
  children: ReactNode,
  picture: string,
  parish?: (info: CalendarInfo) => ReactNode | null,
}) {
  return <div className="flex flex-col items-center">
    <img src={props.picture} className="h-40"/>
    <div className="text-xl font-bold">
      {props.title}
    </div>
    <div className="my-3 grow text-center flex flex-col items-center">
      {props.children}
    </div>
    {props.parish && <div className="flex justify-center flex-wrap gap-2">
      {["emmaus", "inzersdorf", "neustift"].map(id => getCalendarInfo(id as any)).map(props.parish)}
    </div>}
  </div>;
}
