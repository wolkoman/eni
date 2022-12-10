import * as React from "react";
import "../styles/globals.scss";
import {HotJar} from "./HotJar";


export default function RootLayout({children}: { children: React.ReactNode }) {
    return <html lang="en">
    <body>
    {children}
    {/*<ToastContainer position={'top-left'} newestOnTop={true}/>*/}
    <HotJar/>
    </body>
    </html>;
}