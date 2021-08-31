import create from 'zustand'
import {CalendarEvents} from './calendarEvents';
import {useRouter} from 'next/router';

export enum Permission {
  Articles,
  ReaderPlanning,
  PrivateCalendarAccess
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
  load: (token?: string) => void;
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
  load: (token?: string) => {
    if (get().loading || get().loaded) return;
    set(state => ({...state, loading: true}));
    fetch('/api/calendar' + (token ? `?token=${token}` : ''))
      .then(response => response.json())
      .then(data => set(state => ({...state, items: data, loaded: true, loading: false})));
  }
}));

interface UserStore {
  user: { active: boolean, api_key: string, email: string, name: string, group: string } | null,
  permissions: Record<Permission, boolean>,
  load: () => void,
  login: (data: { username: string, password: string }) => void,
  loaded: boolean,
  loading: boolean,
  updatePermission: () => void
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loaded: false,
  loading: false,
  permissions: {
    [Permission.Articles]: false,
    [Permission.ReaderPlanning]: false,
    [Permission.PrivateCalendarAccess]: false
  },
  login: (data) => {
    if (get().loading) return;
    set(state => ({...state, loading: true}));
    fetch('/api/login', {body: JSON.stringify(data), method: 'POST'})
      .then(response => response.json())
      .then(user => {
        sessionStorage.setItem('user', JSON.stringify(user));
        set(state => ({...state, loading: false, loaded: true, user}));
        get().updatePermission();
        location.replace('/intern');
      })
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
        [Permission.ReaderPlanning]: ['admin'].includes(user?.group ?? '')
      }
    }));
  }
}))