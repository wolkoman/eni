import React, {MouseEventHandler, ReactNode} from "react";
import Link from "next/link";

export function Clickable(props: {children: ReactNode, href?: string, className?: string, onClick?: MouseEventHandler<HTMLElement>, disabled?: boolean}){
  const unibox = "bg-black/[2%] rounded-lg transition clickable";
  const clickable = unibox + " hover:bg-black/[4%] cursor-pointer";
  const style = (props.disabled === true ? unibox : clickable) + " " + props.className

  return props.href ? <Link href={props.href} className={style} onClick={props.onClick}>
    {props.children}
  </Link>:<div className={style} onClick={props.onClick}>
    {props.children}
  </div>
}