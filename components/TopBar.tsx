"use client"

import Link from 'next/link';
import React from 'react';
import Responsive from "./Responsive";

import {useUserStore} from "@/store/UserStore";
import {site} from "@/app/(shared)/Instance";
import {Links} from "@/app/(shared)/Links";

function NavItem(props: { href: string, label: string }) {
  return <Link href={props.href}>
    <div className="group relative px-1 lg:px-2 py-1">
      {props.label}
      <div className="absolute inset-0 transition group-hover:bg-black/[3%] scale-75 group-hover:scale-100 rounded"/>
    </div>
  </Link>;
}

export default function TopBar(props: { hidePicture?: boolean, frontpage?: boolean }) {
  const user = useUserStore(state => state.user);
  return site(<div className="py-4 lg:py-6 print:hidden">
    <Responsive>
      <div className="flex justify-between items-center">
        <Link href={Links.Hauptseite}>
          <div className="font-bold text-xl">
            eni.wien
          </div>
        </Link>
        <div className="flex justify-between items-center font-semibold">
          <NavItem href={Links.Termine} label="Termine"/>
          <NavItem href={Links.Wochenmitteilungen()} label="Wochenmitteilungen"/>
          <NavItem href={user ? Links.Intern : Links.Login} label={'Login'}/>
        </div>
      </div>
    </Responsive>
  </div>, props.frontpage ? <></> : <div className="relative">
    <div
      className={`flex flex-row justify-between items-center p-4 lg:px-24 z-10 bg-emmaus text-white relative`}
      data-testid="navbar">
      <Link href={Links.Hauptseite}>
        <div className="cursor-pointer flex gap-3">
          <img src="/dot/edot.svg" className="h-12 border border-white/20 rounded-full"/>
          <div className="leading-4">
            <div className="opacity-50">Römisch-katholische</div>
            <div className="text-2xl font-semibold">Pfarre Emmaus am Wienerberg</div>
          </div>
        </div>
      </Link>
      <div className="hidden justify-center items-center leading-4 md:block opacity-80 text-right">
        <div className="text-md md:ml-24">kanzlei@eni.wien</div>
        <div className="text-md md:ml-24">+43 664 886 32 680</div>
      </div>
    </div>
  </div>);
}
