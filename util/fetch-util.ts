import {toast} from 'react-toastify';

export const fetchJson = (input: RequestInfo, init?: RequestInit, toastOptions?: { pending: string, success: string, error: string }) =>
  (toastOptions ? toast.promise(fetch(input, init), toastOptions) : fetch(input, init))
    .then(response => {
      if (!response.ok)
        throw new Error('Response not successful');
      return response.json();
    });