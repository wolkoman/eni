import create from 'zustand';
import {fetchJson} from './fetch-util';
import {User} from './user';
import {useEffect} from "react";
import {deleteCookie, getCookie, setCookie} from "cookies-next";
import {JwtPayload, verify} from "jsonwebtoken";

export function useAuthenticatedUserStore() {

    const [load, loaded, user] = useUserStore(state => [state.load, state.loaded, state.user]);
    useEffect(() => {
        load();
    }, [])
    return {user, loaded};
}

function decodeJwt(jwt: string): { user: User, exp: number } {
    const payload = verify(jwt, Buffer.from(process.env.NEXT_PUBLIC_KEY!, 'base64')) as JwtPayload;
    return {user: payload as User, exp: payload.exp!};
}

export const useUserStore = create<{
    setJwt: (jwt: string) => Promise<any>,
    user?: User,
    load: () => void,
    login: (data: { username: string, password: string }) => Promise<any>,
    logout: () => void,
    loaded: boolean,
    loading: boolean,
}>((set, get) => ({
    loaded: false,
    loading: false,
    setJwt: async (jwt) => {
        if (get().loading) return;
        set(state => ({...state, loading: true}));
        setCookie("jwt", jwt);
        const {user} = decodeJwt(jwt);
        set({user, loaded: true, loading: false});
    },
    login: (data) => {
        if (get().loading) return Promise.resolve();
        set(state => ({...state, loading: true}));
        return fetchJson('/api/login', {body: JSON.stringify(data), method: 'POST'})
            .then(() => {
                const {user} = decodeJwt(getCookie("jwt") as string);
                set({user, loaded: true, loading: false});
            }).catch(() => {
                set({loading: false});
                throw new Error();
            })
    },
    logout: () => {
        set(state => ({...state, user: undefined, loaded: true}));
        deleteCookie('jwt');
    },
    load: () => {
        if (get().loaded) return;
        set({loaded: true});
        const jwt = getCookie('jwt');
        if(typeof jwt !== "string") return;
        set({user: decodeJwt(jwt).user, loaded: true});
    }
}));