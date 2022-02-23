import {useRouter} from 'next/router';
import {useEffect} from 'react';
import { useUserStore } from './use-user-store';
import {Permission} from './verify';

export const usePermission = (requiredPermissions: Permission[] = []) => {
  const [user, permissions, load, loaded] = useUserStore(state => [state.user, state.user?.permissions ?? {}, state.load, state.loaded]);
  const router = useRouter();
  useEffect(() => load(), []);
  useEffect(() => {
    if(loaded){
      if (!user?.active) {
        router.push('/');
      }else{
        const unauthorized = requiredPermissions.some(p => !permissions[p]);
        if(unauthorized){
          router.push('/');
        }
      }
    }
  }, [user, load, loaded]);
};