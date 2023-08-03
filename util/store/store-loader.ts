import {State, StateCreator, StoreMutatorIdentifier} from "zustand";

type StoreLoader = <
    T extends State,
    Mps extends [StoreMutatorIdentifier, unknown][] = [],
    Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
    f: StateCreator<T, Mps, Mcs>,
    name?: string
) => StateCreator<T, Mps, Mcs>
type StoreLoaderImpl = <T extends State>(
    f: StateCreator<T, [], []>,
    name?: string
) => StateCreator<T, [], []>
const autoloaderImpl: StoreLoaderImpl = (f, name) => (set, get, store) => {
    type T = ReturnType<typeof f>
    let loadCalled = false
    const loadedGet: typeof get = () => {
        const state: any = get();
        if (!loadCalled && 'load' in state) {
            console.log("LOAD")
            loadCalled = true;
            state.load()
        }
        return state
    }
    store.getState = loadedGet
    return f(set, loadedGet, store)
}
export const autoloader = autoloaderImpl as unknown as StoreLoader
