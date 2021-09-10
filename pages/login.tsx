import React, {useEffect, useState} from 'react';
import Site from '../components/Site';
import {useUserStore} from '../util/store';
import Button from '../components/Button';

export default function Events() {
  const [data, setData] = useState({username: '', password: ''});
  const [loading, setLoading] = useState(false);
  const [user, login] = useUserStore(state => [state.user, state.login])

  useEffect(() => {
    if (!user?.active) {
      setLoading(false);
      setData({username: '', password: ''});
    }
  }, [user]);
  return <Site navbar={false} responsive={false}>
    <div className="w-full h-screen relative flex flex-col justify-center items-center bg-gray-100">
      <div className="z-10 bg-white border border-gray-200 shadow-lg">
        <div className="h-1 bg-primary1 w-full"/>
        <div className="h-1 bg-primary2 w-full"/>
        <div className="h-1 bg-primary3 w-full"/>
        <div className="px-8 py-4 flex flex-col items-center">
          {loading ? <>lädt</> : <>
            <div className="font-bold text-2xl my-3">eni.wien</div>
            <input placeholder="Benutzername" className="my-1 py-1 px-3"
                   onChange={(event) => setData({...data, username: (event as any).target.value})}/>
            <input placeholder="Passwort" className="my-1 py-1 px-3" type="password"
                   onChange={(event) => setData({...data, password: (event as any).target.value})}/>
            <Button className="mt-6 w-full text-center" onClick={() => {
              setLoading(true);
              login(data);
            }} label="Anmelden"/>
          </>}
        </div>
      </div>
    </div>
  </Site>;
}