"use client";
import create from 'zustand';
import {useEffect} from "react";

export enum Preference{
    SeparateMass = "SEPARATE_MASS",
    LiturgyInformation = "LITURGY_INFORMATION"
}
const defaults = {
    [Preference.SeparateMass]: true,
    [Preference.LiturgyInformation]: false,
}
const PREFERENCES_KEY = "eniPreferences";
function getPreferences(): Record<Preference, boolean>{
    return JSON.parse(window.localStorage.getItem(PREFERENCES_KEY) ?? JSON.stringify(defaults));
}
export const _usePreferenceStore = create<{
    preferences: Record<Preference, boolean>;
    load: () => any;
    setValue: (preference: Preference, value: boolean) => any;
}>((set, get) => ({
    preferences: defaults,
    load: () => {
        set({preferences: getPreferences()});
    },
    setValue: (preference, value) => {
        set({preferences: {...get().preferences, [preference]: value}})
        window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify({...getPreferences(), [preference]: value}));
    }
}));
export const usePreference = (preference: Preference): [boolean, (x: boolean) => any] => {
    const store = _usePreferenceStore(state => state);
    useEffect(() => {
        store.load();
    }, []);
    return [
        store.preferences[preference],
        (value: boolean) => store.setValue(preference, value)
    ];
};