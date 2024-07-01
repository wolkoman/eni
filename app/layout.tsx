import "../styles/globals.scss";
import {Toasts} from "./ToastContainer";
import {Metadata} from 'next'
import {ReactNode} from "react";
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: "Pfarre Emmaus am Wienerberg",
  description: "Katholische Pfarre im zehnten Wiener Gemeindebezirk"
}

export default function RootLayout({children,}: { children: ReactNode }) {
  return (
    <html>
    <head>
      <title>{metadata.title as string}</title>
      <meta name="description" content={metadata.description as string}/>
      <link rel="shortcut icon" type="image/png" href="/favicon-emmaus.png"/>
      <meta property="og:title" content={metadata.title as string}/>
      <meta property="og:description" content={metadata.description as string}/>
      <meta property="og:image" content="/social.png"/>
    </head>
    <body className={"bg-back-emmaus print:bg-white"}>
    {children}
    <Analytics/>
    <Toasts/>
    </body>
    </html>
  )
}
