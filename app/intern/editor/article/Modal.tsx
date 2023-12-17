import React, {ReactNode} from "react";
import {motion} from "framer-motion";

export function Modal(props: { children: ReactNode, title?: string }) {
  return <div
    className="absolute inset-0 w-screen h-screen flex items-center justify-center z-20">
    <motion.div
      className="absolute inset-0 bg-black/40"
      initial={{opacity: 0}}
      exit={{opacity: 0}}
      animate={{opacity: 1}}
    />
    <motion.div
      className="relative bg-white rounded-lg shadow-lg text-center p-8"
      initial={{opacity: 0, scale: 0.2}}
      exit={{opacity: 0, scale: 0.2}}
      animate={{opacity: 1, scale: 1}}>
      {props.title && <div className="font-bold mb-2">{props.title}</div>}
      <div>{props.children}</div>
    </motion.div>
  </div>
}