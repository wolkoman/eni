"use client"

import Link from 'next/link';
import React from 'react';
import {Links} from "@/app/(shared)/Links";
import {useUserStore} from "@/store/UserStore";
import {PiListBold} from "react-icons/pi";
import {motion} from 'framer-motion';

export function NavItem(props: { href: string, label: string }) {
  return <Link href={props.href}>
    <div className="group relative px-1 lg:px-2 py-1">
      {props.label}
      <div
        className="absolute inset-0 transition group-hover:bg-black/[3%] scale-75 group-hover:scale-100 rounded"/>
    </div>
  </Link>;
}

export default function TopBar(props: {frontpage?: boolean}) {
  const user = useUserStore(state => state.user);
  const links = [
    {text: "Termine", link: Links.Termine},
    {text: "Wochenmitteilungen", link: Links.Wochenmitteilungen()},
    {text: user ? 'Intern' : 'Login', link: user ? Links.Intern : Links.Login},
  ]
  const [open, setOpen] = React.useState(false);

  return <div className="relative print:hidden">
    <div
      className={`flex flex-row justify-between items-center p-4 lg:px-24 z-10 relative ${props.frontpage ? "bg-emmaus text-white" : "bg-back-emmaus"}`}
      data-testid="navbar">
      <Link href={Links.Hauptseite}>
        <div className="cursor-pointer flex gap-3 items-center">
          <img src="/dot/edot.svg" className="h-8 border border-white/20 rounded-full"/>
          <div className="text-base font-semibold">Pfarre Emmaus am Wienerberg</div>
        </div>
      </Link>
      <div className="lg:hidden p-3" onClick={() => setOpen(open => !open)}><PiListBold/></div>
      <div className="hidden lg:flex justify-between items-center font-semibold">
        {links.map(link => <NavItem key={link.link} href={link.link} label={link.text}/>)}
      </div>
    </div>
    <motion.div
      animate={{height: open ? "auto" : 0}}
      initial={false}
      className="flex flex-col bg-white overflow-hidden"
    >
      {links.map(link => <Link
        className="px-4 py-2 border-b border-black/10"
        key={link.link}
        href={link.link}
        children={link.text}
      />)}
    </motion.div>
  </div>;
}
