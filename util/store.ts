import create from 'zustand'
import {CalendarEvents} from './calendar-events';
import {fetchJson} from './fetch-util';
import {toast} from 'react-toastify';
import {Permissions, resolvePermissions} from './verify';
import {User} from 'cockpit-sdk';
import {verify} from 'jsonwebtoken';

interface ArticleStore {
  items: any[];
  loading: boolean;
  loaded: boolean;
  load: () => void;
}

interface CalendarStore {
  items: CalendarEvents;
  cache?: string;
  loading: boolean;
  loaded: boolean;
  error: boolean;
  load: (token?: string) => void;
}

interface UserStore {
  jwt?: string,
  user?: User,
  permissions: Permissions,
  load: () => void,
  login: (data: { username: string, password: string }) => Promise<any>,
  logout: () => void,
  loaded: boolean,
  loading: boolean,
  updatePermission: () => void
}

interface OverlayStore {
  display: (component: React.ReactNode, position: {x: number, y: number}) => void,
  hide: () => void,
  registerHide: (hide: (() => void)) => void;
  registerDisplay: (display: ((component: React.ReactNode, position: {x: number, y: number}) => void)) => void,
}

export const useArticleStore = create<ArticleStore>((set, get) => ({
  items: [],
  loaded: false,
  loading: false,
  load: () => {
    if (get().loading || get().loaded) return;
    set(state => ({...state, loading: true}));
    fetchJson('/api/articles')
      .then(data => set(state => ({...state, items: data, loaded: true, loading: false})))
      .catch(() => toast("Beiträge konnten nicht geladen werden!"));
  }
}));

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  items: {},
  loaded: false,
  loading: false,
  error: false,
  load: (jwt?: string) => {
    if (get().loading) return;
    set(state => ({...state, loading: true}));
    fetchJson('/api/calendar', {jwt})
      .then(data => set(state => ({...state, items: data.events, loaded: true, loading: false, cache: data.cache})))
      .catch(() => set(state => ({...state, items: {}, loaded: true, loading: false, error: true})));
  }
}));

export const useUserStore = create<UserStore>((set, get) => ({
  loaded: false,
  loading: false,
  permissions: {},
  login: (data) => {
    if (get().loading) return Promise.resolve();
    set(state => ({...state, loading: true}));
    return fetchJson('/api/login', {body: JSON.stringify(data), method: 'POST'})
      .then(({jwt}) => {
        const user = verify(jwt, Buffer.from(process.env.NEXT_PUBLIC_KEY!, 'base64')) as User;
        if(user){
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
    location.href = "/";
  },
  load: () => {
    if (get().loaded) return;
    set(state => ({...state, user: JSON.parse(sessionStorage.getItem('user') ?? '{}'), jwt: JSON.parse(sessionStorage.getItem('jwt') ?? '{}'), loaded: true}));
    get().updatePermission();
  },
  updatePermission: () => {
    const user = get().user;
    if(user === null) return;
    set(state => ({
      ...state, user, loaded: true, permissions: resolvePermissions(user?.group)
    }));
  }
}));

export const useOverlayStore = create<OverlayStore>((set, get) => ({
  display: (component: React.ReactNode, position: {x: number, y: number}) => {
    console.warn("display not set");
  },
  hide: () => {
    console.warn("hide not set");
  },
  registerDisplay: (display: ((component: React.ReactNode, position: {x: number, y: number}) => void)) => {
    set(state => ({...state, display}));
  },
  registerHide: (hide: (() => void)) => {
    set(state => ({...state, hide}));
  },
}));