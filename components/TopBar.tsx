"use client"

import Link from 'next/link';
import React from 'react';
import Responsive from "./Responsive";

import {useUserStore} from "@/store/UserStore";
import {site} from "@/app/(shared)/Instance";
import {Links} from "@/app/(shared)/Links";

function NavItem(props: { href: string, label: string }) {
  return <Link href={props.href}>
    <div className="group relative px-2 py-1">
      {props.label}
      <div className="absolute inset-0 transition group-hover:bg-black/[3%] scale-75 group-hover:scale-100 rounded"/>
    </div>
  </Link>;
}

export default function TopBar(props: { hidePicture?: boolean, frontpage?: boolean }) {
  const user = useUserStore(state => state.user);
  return site(<div className="py-4 lg:py-6">
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
  </div>, <div className="relative">
    {!props.frontpage && <div className="bg-gradient-to-t from-black/20 to-black/0 absolute bottom-0 w-full h-16 z-20 pointer-events-none"/>}
    <div
      className={`flex flex-row justify-between py-4 px-10 lg:px-24 z-10 bg-emmaus text-white relative`}
      data-testid="navbar">
      <Link href={Links.Hauptseite}>
        <div className="text-3xl cursor-pointer">
          {props.frontpage ? <></> : <div className="flex space-x-4">
            <div>Pfarre Emmaus</div>
          </div>}
        </div>
      </Link>
      <div className="flex flex-col justify-center items-center leading-4 hidden md:block opacity-80 text-right">
        <div className="text-md md:ml-24">kanzlei@eni.wien</div>
        <div className="text-md md:ml-24">{site("+43 664 886 32 680", "+43 1 616 34 00")}</div>
      </div>
    </div>
  </div>);
}
