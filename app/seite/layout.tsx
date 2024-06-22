import {ReactNode} from "react";
import {site} from "@/app/(shared)/Instance";
import {notFound} from "next/navigation";


export default function RootLayout({children}: { children: ReactNode }) {

  if(site(true, false)) notFound()

  return children
}
