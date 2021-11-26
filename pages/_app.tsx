import "../styles/globals.scss";
import * as React from 'react';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/toast-override.scss";
import "swiper/css/bundle";
import {useOverlayStore} from '../util/store';
import {useEffect, useState} from 'react';

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

function OverlayContainer() {
  const [registerDisplay, registerHide] = useOverlayStore(state => [state.registerDisplay, state.registerHide]);
  const [component, setComponent] = useState<React.ReactNode>();
  const [position, setPosition] = useState<{x: number, y: number}>();
  useEffect(() => {
    registerDisplay((component, position) => {
      setComponent(component);
      setPosition(position);
    });
    registerHide(() => {
      setComponent(undefined);
    })
  }, []);
  return component ? <div className="fixed" style={{top: position?.y, left: position?.x}}>{component}</div> : <div/>;
}

function MyApp({ Component, pageProps }: any) {
  return <>
    <Component {...pageProps} />
    <ToastContainer position={'top-left'} newestOnTop={true}/>
    <OverlayContainer/>
  </>
}

export default MyApp