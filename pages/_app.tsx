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
      const { setupServer } = require('msw/node')
      const requestInterceptor = setupServer()
      requestInterceptor.listen({})
      return requestInterceptor
    })()
    : undefined;

function MyApp({ Component, pageProps }: any) {
  return <>
    <Component {...pageProps} />
    <ToastContainer position={'top-left'} newestOnTop={true}/>
  </>
}

export default MyApp