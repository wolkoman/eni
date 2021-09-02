import Link from 'next/link';
import React from 'react';

export default function Navbar() {
  return <>
    <div className="fixed top-0 left-0 w-full">
      <div className="bg-primary1" style={{height: 5.7}}/>
      <div className="bg-primary2" style={{height: 5.7}}/>
      <div className="bg-primary3" style={{height: 5.7}}/>
    </div>
    <div className="pt-4 mb-4 bg-white z-10 relative">
      <div className="flex flex-row items-end">
        <div className="flex flex-col flex-grow">
          <div className="flex">
            <div className="flex flex-col pb-2 leading-4 hidden md:block opacity-80">
              <div className="text-md md:ml-24">
                kanzlei@eni.wien
              </div>
              <div className="text-md md:ml-24">
                +1 616 4340
              </div>
            </div>
            <Link href="/">
              <div className="font-bold text-3xl pb-2 ml-6 cursor-pointer">
                eni.wien
              </div>
            </Link>
            <div className="flex-grow justify-end pr-2 hidden">
              <div className="font-bold pb-1 cursor-pointer self-end text-gray-600 px-3">
                Kalender
              </div>
              <div className="font-bold pb-1 cursor-pointer self-end text-gray-600 px-3">
                Team
              </div>
              <div className="font-bold pb-1 cursor-pointer self-end text-gray-600 px-3">
                Newsletter
              </div>
            </div>
          </div>
          <div className="bg-primary1" style={{height: 5.7}}/>
          <div className="bg-primary2" style={{height: 5.7}}/>
          <div className="bg-primary3" style={{height: 5.7}}/>
        </div>
        <img src="/logos-24.svg" className="w-48"/>
        <div className="w-2 md:w-12"/>
      </div>
    </div>
  </>;
}
