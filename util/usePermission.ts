import {Permission, useUserStore} from './store';
import {useRouter} from 'next/router';
import {useEffect} from 'react';

export const usePermission = (requiredPermissions: Permission[] = []) => {
  const [user, permissions, load, loaded] = useUserStore(state => [state.user, state.permissions, state.load, state.loaded]);
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