"use client";

import React, {useEffect} from 'react';
import Site from '../../../components/Site';
import Button from '../../../components/Button';
import {useState} from '@/app/(shared)/use-state-util';
import {useRouter, useSearchParams} from 'next/navigation';
import {useUserStore} from "@/store/UserStore";
import {Links} from "../../(shared)/Links";
import Link from "next/link";

export function LoginPage() {
    const [data, setData, setPartialData] = useState({username: '', password: ''});
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false);
    const [user, _login, setJwt] = useUserStore(state => [state.user, state.login, state.setJwt, state])
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
        router.push(searchParams.has("redirect") ? searchParams.get("redirect") as string : Links.Intern);
    }

    function login() {
        setLoading(true)
        _login(data)
          .then(() => onLogin())
          .catch(() => {
              setPartialData({password: ''});
              setLoading(false);
          })
    }

    const buttonDisabled = data.username.length === 0 || data.password.length === 0;

    return <Site navbar={false} responsive={false} footer={false} title="Login">
        <div className="w-full h-screen relative flex flex-col justify-center items-center">
            <div
              className={`z-10 bg-white border border-emmaus/50 rounded-lg overflow-hidden ${loading || disabled ? 'pointer-events-none select-none' : ''}`}>
                <div className="p-8 flex flex-col items-center">
                    <div className="font-bold text-2xl mb-5">Emmaus Login</div>
                    <input placeholder="Benutzername" className="my-1 py-1 px-3 rounded bg-emmaus/5"
                           value={data.username}
                           disabled={loading}
                           onChange={(event) => setData({...data, username: (event as any).target.value})}/>
                    <input placeholder="Passwort" className="my-1 py-1 px-3 rounded bg-emmaus/5" type="password"
                           value={data.password}
                           disabled={loading}
                           onChange={(event) => setData({...data, password: (event as any).target.value})}
                           onKeyDown={(e) => {
                               if (e.key === "Enter" && !buttonDisabled) login()
                           }}
                    />
                    <div className={`${loading ? "animate-pulse" : ""} mt-4 w-full text-center grid`}>
                        <Button onClick={() => login()} label="Anmelden" disabled={buttonDisabled} loading={loading}/>
                    </div>
                </div>
            </div>
            <Link href={Links.Status} className="mt-2 bg-white border border-emmaus/50 rounded overflow-hidden">
                <img src="https://api.checklyhq.com/v1/badges/groups/699811?style=for-the-badge&theme=light" alt="Status badge" />
            </Link>
        </div>
    </Site>;
}
