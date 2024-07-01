import "../styles/globals.scss";
import {Toasts} from "./ToastContainer";
import {Metadata, Viewport} from 'next'
import {ReactNode} from "react";
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: "Pfarre Emmaus am Wienerberg",
  description: "Katholische Pfarre im zehnten Wiener Gemeindebezirk",
  icons: "/favicon-emmaus.png",
}
export const viewport: Viewport = {
  themeColor: '#2a6266',
}

export default function RootLayout({children,}: { children: ReactNode }) {
  return (
    <html>
    <head>
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
