import * as React from 'react';
import "../styles/globals.scss";

// Used by next-fixutre.ts to pass requestInterceptor to each test,
// where it can be used to set up the server-side request mocks.
process.env.PLAYWRIGHT === '1' && typeof window === 'undefined'
    ? (() => {
        const {setupServer} = require('msw/node')
        const requestInterceptor = setupServer()
        requestInterceptor.listen({})
        return requestInterceptor
    })()
    : undefined;

function MyApp({Component, pageProps}: any) {
    return <>
        <Component {...pageProps} />
    </>
}

export default MyApp
