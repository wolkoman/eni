import {combine, persist} from "zustand/middleware";
import create from "zustand";

export enum Preference {
  SeparateMass = "SEPARATE_MASS",
  MonthView = "MONTH_VIEW_PREVIEW",
}

const _usePreferenceStore = create(persist(combine({
  preferences: {
    [Preference.SeparateMass]: true,
    [Preference.MonthView]: false,
  }
}, (set, get) => ({
  setValue: (preference: Preference, value: boolean) => {
    set({preferences: {...get().preferences, [preference]: value}})
  }
})), {name: "preferences-store"}));
export const usePreferenceStore = (preference: Preference): [boolean, (x: boolean) => any] => {
  const store = _usePreferenceStore(state => state);
  return [
    store.preferences[preference],
    (value: boolean) => store.setValue(preference, value)
  ];
};
