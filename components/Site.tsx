import TopBar from './TopBar';
import Responsive from './Responsive';
import React, {ReactNode} from 'react';
import Footer from './Footer';

import {site} from "@/app/(shared)/Instance";

export default function Site(props: {
  title?: string,
  children: ReactNode,
  responsive?: boolean,
  showTitle?: boolean,
  navbar?: boolean,
  footer?: boolean
}) {
  return <>
    <div style={{minHeight: '100vh'}} className="flex flex-col justify-between">
      <div className="flex-grow flex flex-col items-stretch">
        {(props.navbar ?? true) && <>
            <TopBar/>
          {site(<></>, props.showTitle && <div className="text-4xl font-bold pt-8 mb-16 px-10">
              <div className="translate-y-6 max-w-5xl mx-auto relative">
                {props.title}
              </div>
          </div>)}
        </>}
        {(props.responsive ?? true) ? <Responsive>
          {props.title && props.showTitle
            ? <div className="text-4xl font-bold my-6 lg:my-12">
              {site(props.title, null)}
            </div>
            : null
          }
          {props.children}
        </Responsive> : <>
          {site(props.title, null) && props.showTitle ? <Responsive size="md">
            <div className="text-4xl font-bold my-6 lg:my-12">
              {site(props.title, null)}
            </div>
          </Responsive> : <></>}
          {props.children}
        </>}
      </div>
      {(props.footer ?? true) && <Footer/>}
    </div>
  </>;
}
