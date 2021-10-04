import Navbar from './Navbar';
import Responsive from './Responsive';
import React, {useEffect} from 'react';
import Footer from './Footer';
import Head from 'next/head';

export default function Site({ children, responsive = true, narrow = false, navbar = true, footer = true, title }:{title?: string, children: React.ReactNode, responsive?: boolean , narrow?: boolean, navbar?: boolean, footer?: boolean}){

  useEffect(() => {
    if(window.location.href.includes("next.eni.wien")){
      window.location.replace("https://eni.wien/redirect");
    }
  })

  return <>
    <Head>
      <title>eni.wien</title>
      <script type="text/javascript" src="https://app.mailjet.com/statics/js/widget.modal.js"/>
    </Head>
    <div style={{minHeight: "100vh"}} className="flex flex-col justify-between">
      <div>
    {navbar && <Navbar/>}
    {responsive ?  <Responsive narrow={narrow}>
      {title ? <div className="font-bold text-2xl my-4">{title}</div> : null}
      {children}
    </Responsive>: children}
      </div>
    {navbar && <Footer />}
  </div></>;
}