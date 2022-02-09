import create from 'zustand';
import {fetchJson} from './fetch-util';
import {toast} from 'react-toastify';

export const useArticleStore = create<{
    items: any[];
    loading: boolean;
    loaded: boolean;
    load: () => void;
}>((set, get) => ({
    items: [],
    loaded: false,
    loading: false,
    load: () => {
        if (get().loading || get().loaded) return;
        set(state => ({...state, loading: true}));
        fetchJson('/api/articles')
            .then(data => set(state => ({...state, items: data, loaded: true, loading: false})))
            .catch(() => toast('Beiträge konnten nicht geladen werden!'));
    }
}));