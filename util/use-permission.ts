import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {useAuthenticatedUserStore} from './store/use-user-store';
import {Permission} from './verify';

export const usePermission = (requiredPermissions: Permission[] = []) => {
    const {user, loaded} = useAuthenticatedUserStore()
    const router = useRouter();
    useEffect(() => {
        if (!loaded) return;
        const unauthorized = requiredPermissions.some(p => !user?.permissions[p]);
        if (unauthorized) {
            router.push('/intern/login');
        }else if (!user) {
            router.push('/');
        }
    }, [loaded, user]);
};