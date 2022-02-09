import create from 'zustand';
import {User} from 'cockpit-sdk';
import {Permissions, resolvePermissions} from './verify';
import {fetchJson} from './fetch-util';
import {verify} from 'jsonwebtoken';

export const useUserStore = create<{
    jwt?: string,
    user?: User,
    permissions: Permissions,
    load: () => void,
    login: (data: { username: string, password: string }) => Promise<any>,
    logout: () => void,
    loaded: boolean,
    loading: boolean,
    updatePermission: () => void
}>((set, get) => ({
    loaded: false,
    loading: false,
    permissions: {},
    login: (data) => {
        if (get().loading) return Promise.resolve();
        set(state => ({...state, loading: true}));
        return fetchJson('/api/login', {body: JSON.stringify(data), method: 'POST'})
            .then(({jwt}) => {
                const user = verify(jwt, Buffer.from(process.env.NEXT_PUBLIC_KEY!, 'base64')) as User;
                if (user) {
                    set(state => ({...state, user, jwt, loaded: true, loading: false}));
                    get().updatePermission();
                    sessionStorage.setItem('user', JSON.stringify(user));
                    sessionStorage.setItem('jwt', JSON.stringify(jwt));
                }
            }).catch(() => {
                set(state => ({...state, loading: false}));
                throw new Error();
            })
    },
    logout: () => {
        set(state => ({...state, user: undefined, jwt: undefined, loaded: false}));
        get().updatePermission();
        sessionStorage.clear();
        location.href = '/';
    },
    load: () => {
        if (get().loaded) return;
        set(state => ({
            ...state,
            user: JSON.parse(sessionStorage.getItem('user') ?? '{}'),
            jwt: JSON.parse(sessionStorage.getItem('jwt') ?? '{}'),
            loaded: true
        }));
        get().updatePermission();
    },
    updatePermission: () => {
        const user = get().user;
        if (user === null) return;
        set(state => ({
            ...state, user, loaded: true, permissions: resolvePermissions(user?.group)
        }));
    }
}));