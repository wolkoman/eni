import {CalendarInfo} from "../(domain)/events/CalendarInfo";
import React, {ReactNode} from "react";
import Button from "../../components/Button";
import Image from "next/image";

export function ParishButton(props: { info: CalendarInfo, children?: ReactNode }) {
  return <Button label={<div className="flex gap-2 items-center">
    <Image src={props.info.dot} alt="Emmaus" width={20} height={20}/>
    {props.children ?? props.info.shortName}
  </div>}/>;
}