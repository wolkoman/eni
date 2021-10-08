import React, {useEffect, useState} from 'react';

export default function Redirect() {
  const [redirectIn, setRedirectIn] = useState(8);
  useEffect(() => {
    if(redirectIn === 0)
      window.location.replace("/");
    else
    setTimeout(() => setRedirectIn(x => x-1), 1000)
  }, [redirectIn])
  return <div className="flex flex-col h-screen items-center justify-center">
    <div className="max-w-lg text-lg font-bold">Bitte benutzen Sie künftig <i>eni.wien</i>.</div>
    <div>Sie werden in {redirectIn} Sekunden weitergeleitet.</div>
  </div>
}