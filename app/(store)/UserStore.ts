import {JwtPayload, verify} from "jsonwebtoken";
import {createLoadedStore} from "@/store/CreateLoadedStore";
import {createStore} from "zustand";
import {combine} from "zustand/middleware";
import {deleteCookie, getCookie, setCookie} from "cookies-next";
import {User} from "@/domain/users/User";
import {fetchJson} from "@/app/(shared)/FetchJson";
import {Links} from "@/app/(shared)/Links";

function decodeJwt(jwt: string): { user: User, exp: number } {
    const payload = verify(jwt, Buffer.from(process.env.NEXT_PUBLIC_KEY!, 'base64')) as JwtPayload;
    return {user: payload as User, exp: payload.exp!};
}

export const userStore = createStore(combine({
    user: null as User | null,
    loaded: false,
    loading: false,
}, (set, get) => ({
    setJwt: async (jwt: string) => {
        if (get().loading) return;
        set(state => ({...state, loading: true}));
        setCookie("jwt", jwt);
        const {user} = decodeJwt(jwt);
        set({user, loaded: true, loading: false});
    },
    login: (data: { username: string, password: string }) => {
        if (get().loading) return Promise.resolve();
        set(state => ({...state, loading: true}));
        return fetchJson(Links.ApiLogin, {body: JSON.stringify(data), method: 'POST'})
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
        if (typeof jwt !== "string") return undefined;
        const user = decodeJwt(jwt).user;
        console.log("userload", user)
        set({user, loaded: true});
        return user;
    }
})));
export const useUserStore = createLoadedStore(userStore);
