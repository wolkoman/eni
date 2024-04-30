import React, {ReactNode, useState} from "react";
import Button from "../../components/Button";

export function OptionsButton(props: { children: ReactNode[] } & Parameters<typeof Button>[0]) {
  const [open, setOpen] = useState(false)
  return <>
    {open && <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}/>}
    <div className="relative">
      <Button {...props} onClick={() => setOpen(x => !x)}/>
      {open && <div className={`transition-all absolute bottom-0 left-0 w-auto translate-y-full z-30 flex`}>
          <div
              onClick={() => setOpen(false)}
              className={(open ? "" : " pointer-events-none -translate-y-2 ") + " flex flex-col rounded overflow-hidden shadow"}>
            {props.children}
          </div>
      </div>}
    </div>
  </>;
}
