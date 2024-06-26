import * as React from "react";
import {ReactNode} from "react";
import Button from "@/components/Button";
import {PiArrowRight, PiArrowRightBold} from "react-icons/pi";

export function Container(props: { id: string, children: ReactNode, title?: string }) {
  return <div id={props.id} className="rounded-lg border border-emmaus/50 bg-white/50">
    {props.title && <div className="text-emmaus text-lg px-3 flex justify-between items-center">
        <div className="font-semibold">{props.title}</div>
        <Button label="Alle" secondary icon={<PiArrowRightBold/>}></Button>

    </div>}
    {props.children}
  </div>;
}
