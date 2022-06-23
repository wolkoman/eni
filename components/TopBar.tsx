import Link from 'next/link';
import {site, SiteType, siteType} from '../util/sites';
import React from 'react';

export default function TopBar() {
  return <div className="flex flex-row justify-between py-4 px-10 lg:px-24 z-10" data-testid="navbar">
    <Link href="/">
      <div className="text-3xl cursor-pointer" data-testid="title">
        {{
          [SiteType.ENI]: <div className="flex space-x-4">
            <div>eni.wien</div>
            <img src={site('/logo.svg', '/logo_emmaus.svg')} className="w-32 hidden"/>
          </div>,
          [SiteType.EMMAUS]: <div className="flex space-x-4">
            <div>tesarekplatz.at</div>
          </div>
        }[siteType]}
      </div>
    </Link>
    {site(<></>,<Link href="/menu"><div className="flex flex-col justify-center items-center md:hidden">
      <div className="bg-black/70 h-1 w-8 mb-1.5 mt-2"/>
      <div className="bg-black/70 h-1 w-8 mb-1.5"/>
      <div className="bg-black/70 h-1 w-8 mb-1.5"/>
    </div></Link>)}
    <div className="flex flex-col justify-center items-center leading-4 hidden md:block opacity-80 text-right">
      <div className="text-md md:ml-24">kanzlei@eni.wien</div>
      <div className="text-md md:ml-24">{site("+43 664 886 32 680","+43 1 616 34 00")}</div>
    </div>
  </div>;
}