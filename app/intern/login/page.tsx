import React, { Suspense } from 'react';
import {LoginPage} from "./LoginPage";

export default function Events() {
  return <Suspense fallback={"lädt..."}><LoginPage/></Suspense>
}