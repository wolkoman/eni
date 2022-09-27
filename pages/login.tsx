import React, {useEffect} from 'react';
import Site from '../components/Site';
import Button from '../components/Button';
import {toast} from 'react-toastify';
import {useState} from '../util/use-state-util';
import {useRouter} from 'next/router';
import {useUserStore} from '../util/use-user-store';
import Link from "next/link";

export default function Events() {
    const [data, setData, setPartialData] = useState({username: '', password: ''});
    const [disabled, setDisabled] = useState(false);
    const [user, _login, loading] = useUserStore(state => [state.user, state.login, state.loading])
    const router = useRouter();

    useEffect(() => {
        console.log({user});
        if (!user?.active) {
            setData({username: '', password: ''});
        }else{
            router.push("/intern");
        }
    }, [user, router, setData]);

    function login() {
        toast.promise(_login(data), {
            error: 'Anmeldedaten sind nicht korrekt',
            pending: 'Anmeldung läuft...',
            success: 'Anmeldung erfolgreich'
        }).then(() => {
            setDisabled(true);
            router.push('/intern');
        }).catch(() => {
            setPartialData({password: ''});
        });
    }

    function buttonDisabled() {
        return data.username.length === 0 || data.password.length === 0;
    }

    return <Site navbar={false} responsive={false} footer={false} title="Login">
        <div
            className="w-full h-screen relative flex flex-col justify-center items-center bg-[url(/bg-login.svg)] bg-cover bg-center">
            <div
                className={`z-10 bg-white borde border-gray-200 shadow-lg rounded-lg overflow-hidden ${loading || disabled ? 'pointer-events-none opacity-50 select-none' : ''}`}>
                <div className="p-8 flex flex-col items-center">
                    <div className="font-bold text-2xl mb-5">eine neue initiative</div>
                    <input placeholder="Benutzername" className="my-1 py-1 px-3 rounded bg-gray-200"
                           value={data.username}
                           onChange={(event) => setData({...data, username: (event as any).target.value})}/>
                    <input placeholder="Passwort" className="my-1 py-1 px-3 rounded bg-gray-200" type="password"
                           value={data.password}
                           onChange={(event) => setData({...data, password: (event as any).target.value})}
                           onKeyDown={(e) => {
                               if (e.key === "Enter" && !buttonDisabled()) login()
                           }}
                    />
                    <Button className="mt-4 w-full text-center" onClick={() => login()} label="Anmelden"
                            disabled={buttonDisabled()}/>
                    <div className="text-xs mt-2">
                        oder{" "}
                        <Link href="https://forms.gle/TJZjvqbvq688J57h7"><span className="text-blue-600 cursor-pointer">weitere Optionen</span></Link>
                    </div>
                </div>
            </div>
        </div>
    </Site>;
}