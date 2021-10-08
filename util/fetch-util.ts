import {toast} from 'react-toastify';

type RequestInitPlus = RequestInit & { jwt?: string };

export const fetchJson = (input: RequestInfo, init?: RequestInitPlus, toastOptions?: { pending: string, success: string, error: string }) => {
  const fetchPlus = (input: RequestInfo, init: RequestInitPlus = {}) => {
    if('jwt' in init){
      init = {...init, headers: {...init.headers, Authorization: `Bearer ${init.jwt}`}};
    }
    return fetch(input, init).then(response => {
      if (!response.ok) {
        throw new Error('Response not successful');
      } else
        return response.json();
    });
  };
  if(toastOptions !== undefined){
    return toast.promise(fetchPlus(input, init), toastOptions);
  }else{
    return fetchPlus(input, init);
  }
};