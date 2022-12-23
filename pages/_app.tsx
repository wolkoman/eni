import "../styles/globals.scss";
import * as React from 'react';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/toast-override.scss";

// Used by next-fixutre.ts to pass requestInterceptor to each test,
// where it can be used to set up the server-side request mocks.
export const requestInterceptor =
    process.env.PLAYWRIGHT === '1' && typeof window === 'undefined'
        ? (() => {
            const {setupServer} = require('msw/node')
            const requestInterceptor = setupServer()
            requestInterceptor.listen({})
            return requestInterceptor
        })()
        : undefined;

function HotJar() {
    return <script dangerouslySetInnerHTML={{__html: `
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:3204390,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `}}/>;
}

function MyApp({Component, pageProps}: any) {
    return <>
        <HotJar/>
        <Component {...pageProps} />
        <ToastContainer position={'top-left'} newestOnTop={true}/>
    </>
}

export default MyApp