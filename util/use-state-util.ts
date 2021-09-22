import {Dispatch, SetStateAction, useState as reactUseState} from 'react';

export const useState = <T>(initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>,  (ps: Partial<T> | ((state: T) => Partial<T>)) => void] => {
  const [reactState, reactSetState] = reactUseState<T>(initialState);
  const setPartialState = (partialState: (Partial<T> | ((state: T) => Partial<T>))) => {
    if (partialState instanceof Function)
      return reactSetState(state => ({...state, ...partialState(state)}));
    else
      return reactSetState(state => ({...state, ...partialState}));
  };
  return [reactState, reactSetState, setPartialState];
};