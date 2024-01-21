import {Dispatch, SetStateAction} from "react";

export function useStoreState<Store, GetKey extends keyof Store, SetKey extends keyof Store>(store: Store, getter: GetKey, setter: SetKey) {
  const set: any = store[setter];
  return [store[getter], ((stateTrans: (prev: Store[GetKey]) => Store[GetKey]) => {
    set(stateTrans(store[getter]))
  }) as Dispatch<SetStateAction<Store[GetKey]>>] as const;
}