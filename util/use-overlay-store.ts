import { ReactNode } from 'react';
import create from 'zustand';

export const useOverlayStore = create<{
    display: (component: ReactNode, position: { x: number, y: number }) => void,
    hide: () => void,
    registerHide: (hide: (() => void)) => void;
    registerDisplay: (display: ((component: ReactNode, position: { x: number, y: number }) => void)) => void,
}>((set) => ({
    display: (component: ReactNode, position: { x: number, y: number }) => {
        console.warn('display not set');
    },
    hide: () => {
        console.warn('hide not set');
    },
    registerDisplay: (display: ((component: ReactNode, position: { x: number, y: number }) => void)) => {
        set(state => ({...state, display}));
    },
    registerHide: (hide: (() => void)) => {
        set(state => ({...state, hide}));
    },
}));