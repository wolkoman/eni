import create from 'zustand';
import {fetchJson} from './fetch-util';
import {User} from './user';
import {useEffect} from "react";
import {deleteCookie} from "cookies-next";

export function useAuthenticatedUserStore() {

    const [load, loaded, user] = useUserStore(state => [state.load, state.loaded, state.user]);
    useEffect(() => {
        load();
    }, [])
    return {user, loaded};
}

export const useUserStore = create<{
    user?: User,
    load: () => void,
    login: (data: { username: string, password: string }) => Promise<any>,
    logout: () => void,
    loaded: boolean,
    loading: boolean,
}>((set, get) => ({
    loaded: false,
    loading: false,
    login: (data) => {
        if (get().loading) return Promise.resolve();
        set(state => ({...state, loading: true}));
        return fetchJson('/api/login', {body: JSON.stringify(data), method: 'POST'})
            .then(({user, expires}) => {
                set(state => ({...state, user, loaded: true, loading: false}));
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('expires', JSON.stringify(expires));
            }).catch(() => {
                set(state => ({...state, loading: false}));
                throw new Error();
            })
    },
    logout: () => {
        set(state => ({...state, user: undefined, loaded: false}));
        localStorage.clear();
        deleteCookie('jwt');
        location.href = '/';
    },
    load: () => {
        if (get().loaded) return;
        const expired = JSON.parse(localStorage.getItem('user') ?? '0') < new Date().getTime();
        set(state => ({
            ...state,
            user: expired ? null : (JSON.parse(localStorage.getItem('user') ?? 'null')),
            loaded: true
        }));
    }
}));