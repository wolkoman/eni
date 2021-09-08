import "../styles/globals.scss";
import * as React from 'react';

// Used by next-fixutre.ts to pass requestInterceptor to each test,
// where it can be used to set up the server-side request mocks.
export const requestInterceptor =
  process.env.PLAYWRIGHT === '1' && typeof window === 'undefined'
    ? (() => {
      const { setupServer } = require('msw/node')
      const requestInterceptor = setupServer()
      requestInterceptor.listen({})
      return requestInterceptor
    })()
    : undefined;

function MyApp({ Component, pageProps }: any) {
  return <Component {...pageProps} />
}

export default MyApp