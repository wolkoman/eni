import React, {useEffect} from 'react';
import Site from '../components/Site';
import {useUserStore} from '../util/store';
import Button from '../components/Button';
import {toast} from 'react-toastify';
import {useState} from '../util/use-state-util';

export default function Events() {
  const [data, setData, setPartialData] = useState({username: '', password: ''});
  const [disabled, setDisabled] = useState(false);
  const [user, _login, loading] = useUserStore(state => [state.user, state.login, state.loading])

  useEffect(() => {
    if (!user?.active) {
      setData({username: '', password: ''});
    }
  }, [user]);

  function login() {
    toast.promise(_login(data), {
      error: 'Anmeldedaten sind nicht korrekt',
      pending: 'Anmeldung läuft...',
      success: 'Anmeldung erfolgreich'
    }).then(() => {
      setDisabled(true);
      location.replace('/intern');
    }).catch(() => {
      setPartialData({password: ''});
      console.log(data);
    });
  }

  function buttonDisabled() {
    return data.username.length === 0 || data.password.length === 0;
  }

  return <Site navbar={false} responsive={false}>
    <div className="w-full h-screen relative flex flex-col justify-center items-center bg-gray-100">
      <div className={`z-10 bg-white border border-gray-200 shadow-lg ${loading || disabled ? 'pointer-events-none opacity-50 select-none' : ''}`}>
        <div className="h-2 bg-primary1 w-full"/>
        <div className="h-2 bg-primary2 w-full"/>
        <div className="h-2 bg-primary3 w-full"/>
        <div className="p-8 flex flex-col items-center">
          <div className="font-bold text-2xl my-3">eni.wien</div>
          <input placeholder="Benutzername" className="my-1 py-1 px-3" value={data.username}
                 onChange={(event) => setData({...data, username: (event as any).target.value})}/>
          <input placeholder="Passwort" className="my-1 py-1 px-3" type="password" value={data.password}
                 onChange={(event) => setData({...data, password: (event as any).target.value})}
                 onKeyDown={(e) => {if(e.key === "Enter" && !buttonDisabled()) login()}}
          />
          <Button className="mt-6 w-full text-center" onClick={() => login()} label="Anmelden" disabled={buttonDisabled()}/>
        </div>
      </div>
    </div>
  </Site>;
}