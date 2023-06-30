import "../styles/globals.scss";
import {Toasts} from "./ToastContainer";
import {site} from "../util/sites";
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: site("eni.wien", "Pfarre Emmaus"),
  description: site("Miteinander der Pfarren Emmaus, St. Nikolaus und Neustift", "Katholische Pfarre im zehnten Wiener Gemeindebezirk")
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html>
      <head>
          <title>{metadata.title as string}</title>
          <meta name="description" content={metadata.description as string}/>
          <link rel="shortcut icon" type="image/png" href={(site("/favicon.png", "/favicon-emmaus.png"))}/>
          <meta property="og:title" content={metadata.title as string} />
          <meta property="og:description" content={metadata.description as string} />
          <meta property="og:image" content="/social.png" />
      </head>
      <body>{children}</body>
      <Toasts/>
    </html>
  )
}
