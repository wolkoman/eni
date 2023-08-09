"use client";

import React, {useEffect} from 'react';
import Site from '../../../components/Site';
import Button from '../../../components/Button';
import {toast} from 'react-toastify';
import {useState} from '../../(shared)/use-state-util';
import {useRouter, useSearchParams} from 'next/navigation';
import {useUserStore} from "../../(store)/UserStore";

export function LoginPage() {
    const [data, setData, setPartialData] = useState({username: '', password: ''});
    const [disabled, setDisabled] = useState(false);
    const [user, _login, setJwt, loading] = useUserStore(state => [state.user, state.login, state.setJwt, state.loading])
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!user?.active) {
            setData({username: '', password: ''});
        }
    }, [user, router, setData]);
    useEffect(() => {
        if (searchParams.has("jwt")) setJwt(searchParams.get("jwt")!).then(onLogin);
    }, [searchParams])

    function onLogin() {
        setDisabled(true);
        router.push(searchParams.has("redirect") ? searchParams.get("redirect") as string : '/intern');
    }

    function login() {
        toast.promise(_login(data), {
            error: 'Anmeldedaten sind nicht korrekt',
            pending: 'Anmeldung läuft...',
            success: 'Anmeldung erfolgreich'
        })
          .then(() => onLogin())
          .catch(() => setPartialData({password: ''}));
    }

    function buttonDisabled() {
        return data.username.length === 0 || data.password.length === 0;
    }

    return <Site navbar={false} responsive={false} footer={false} title="Login">
        <div
          className="w-full h-screen relative flex flex-col justify-center items-center ">
            <div
              className={`z-10 bg-white shadow-lg  border border-black/10 rounded-lg overflow-hidden ${loading || disabled ? 'pointer-events-none select-none' : ''}`}>
                <div className="p-8 flex flex-col items-center">
                    <div className="font-bold text-2xl mb-5">eni.wien</div>
                    <input placeholder="Benutzername" className="my-1 py-1 px-3 rounded bg-gray-200"
                           value={data.username}
                           disabled={loading}
                           onChange={(event) => setData({...data, username: (event as any).target.value})}/>
                    <input placeholder="Passwort" className="my-1 py-1 px-3 rounded bg-gray-200" type="password"
                           value={data.password}
                           disabled={loading}
                           onChange={(event) => setData({...data, password: (event as any).target.value})}
                           onKeyDown={(e) => {
                               if (e.key === "Enter" && !buttonDisabled()) login()
                           }}
                    />
                    <div className={`${loading ? "animate-pulse" : ""} mt-4 w-full text-center grid`}>
                        <Button className="" onClick={() => login()} label="Anmelden"
                                disabled={buttonDisabled()}/>
                    </div>
                </div>
            </div>
        </div>
    </Site>;
}
