import create from 'zustand'
import {CalendarEvents} from './calendar-events';
import {fetchJson} from './fetch-util';

export enum Permission {
  Articles,
  ReaderPlanning,
  PrivateCalendarAccess,
  OrganBooking
}

interface ArticleStore {
  items: any[];
  loading: boolean;
  loaded: boolean;
  load: () => void;
}

interface CalendarStore {
  items: CalendarEvents;
  loading: boolean;
  loaded: boolean;
  error: boolean;
  load: (token?: string) => void;
}

interface UserStore {
  user: { active: boolean, api_key: string, email: string, name: string, group: string, _id: string } | null,
  permissions: Record<Permission, boolean>,
  load: () => void,
  login: (data: { username: string, password: string }) => Promise<any>,
  logout: () => void,
  loaded: boolean,
  loading: boolean,
  updatePermission: () => void
}

export const useArticleStore = create<ArticleStore>((set, get) => ({
  items: [],
  loaded: false,
  loading: false,
  load: () => {
    if (get().loading || get().loaded) return;
    set(state => ({...state, loading: true}));
    fetch('/api/articles')
        .then(response => response.json())
        .then(data => set(state => ({...state, items: data, loaded: true, loading: false})));
  }
}));

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  items: {},
  loaded: false,
  loading: false,
  error: false,
  load: (token?: string) => {
    if (get().loading || get().loaded) return;
    set(state => ({...state, loading: true}));
    fetch('/api/calendar' + (token ? `?token=${token}` : ''))
      .then(response => response.json())
      .then(data => set(state => ({...state, items: data, loaded: true, loading: false})))
      .catch(() => set(state => ({...state, items: {}, loaded: true, loading: false, error: true})));
  }
}));

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loaded: false,
  loading: false,
  permissions: {
    [Permission.Articles]: false,
    [Permission.ReaderPlanning]: false,
    [Permission.PrivateCalendarAccess]: false,
    [Permission.OrganBooking]: false
  },
  login: (data) => {
    if (get().loading) return Promise.resolve();
    set(state => ({...state, loading: true}));
    return fetchJson('/api/login', {body: JSON.stringify(data), method: 'POST'})
      .then(user => {
        sessionStorage.setItem('user', JSON.stringify(user));
        set(state => ({...state, user, loaded: true}));
        get().updatePermission();
      }).catch(() => {
        set(state => ({...state, loading: false}));
        throw new Error();
      })
  },
  logout: () => {
    sessionStorage.removeItem('user');
    set(state => ({...state, user: null, loaded: false}));
    get().updatePermission();
  },
  load: () => {
    if (get().loaded) return;
    set(state => ({...state, user: JSON.parse(sessionStorage.getItem('user') ?? '{}'), loaded: true}));
    get().updatePermission();
  },
  updatePermission: () => {
    const user = get().user as UserStore['user'];
    set(state => ({
      ...state, user, loaded: true, permissions: {
        [Permission.Articles]: ['admin'].includes(user?.group ?? ''),
        [Permission.PrivateCalendarAccess]: ['PrivateCalendarAccess', 'admin'].includes(user?.group ?? ''),
        [Permission.ReaderPlanning]: ['admin'].includes(user?.group ?? ''),
        [Permission.OrganBooking]: ['admin', 'OrganAccess'].includes(user?.group ?? '')
      }
    }));
  }
}));