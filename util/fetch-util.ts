import {toast} from 'react-toastify';

export const fetchJson = (input: RequestInfo, init?: RequestInit, toastOptions?: { pending: string, success: string, error: string }) => {
  const fetchPlus = (input: RequestInfo, init?: RequestInit) => fetch(input,init).then(response => {
    console.log(response);
    if (!response.ok)
      throw new Error('Response not successful');
    else
      return response.json();
  });
  if(toastOptions !== undefined){
    return toast.promise(fetchPlus(input, init), toastOptions);
  }else{
    return fetchPlus(input, init);
  }
};