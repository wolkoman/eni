import {StoreApi, useStore} from "zustand";
import {useEffect} from "react";

export function createLoadedStore<State extends { load: Function }>(store: StoreApi<State>) {
    return <T>(
        selector: (state: State) => T
    ) => {
        useEffect(() => {
            store.getState().load()
        }, [])
        return useStore(store, selector)
    }
}
