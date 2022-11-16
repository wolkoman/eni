import create from 'zustand';
import {fetchJson} from './fetch-util';
import {verify} from 'jsonwebtoken';
import {User} from './user';

export const useUserStore = create<{
    jwt?: string,
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
            .then(({jwt}) => {
                const user = verify(jwt, Buffer.from(process.env.NEXT_PUBLIC_KEY!, 'base64')) as User;
                if (user) {
                    set(state => ({...state, user, jwt, loaded: true, loading: false}));
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
        sessionStorage.clear();
        location.href = '/';
    },
    load: () => {
        if (get().loaded) return;
        set(state => ({
            ...state,
            user: JSON.parse(sessionStorage.getItem('user') ?? 'null'),
            jwt: JSON.parse(sessionStorage.getItem('jwt') ?? 'null'),
            loaded: true
        }));
    }
}));