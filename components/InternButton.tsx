import React, {ReactNode} from "react";
import {Clickable} from "../app/(shared)/Clickable";

export function InternButton({href, label, onClick, children}: {
  href?: string,
  label?: string,
  onClick?: () => any,
  children?: ReactNode
}) {
  return <Clickable onClick={onClick} href={href}
                    className="h-32 rounded-xl flex flex-col justify-center items-center text-center text-xl font-bold">
    {label}{children}
  </Clickable>;
}
