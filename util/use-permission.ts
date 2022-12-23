import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {useAuthenticatedUserStore} from './use-user-store';
import {Permission} from './verify';

export const usePermission = (requiredPermissions: Permission[] = []) => {
    const {user, loaded} = useAuthenticatedUserStore()
    const router = useRouter();
    useEffect(() => {
        console.log({loaded,user});
        if (!loaded) return;
        const unauthorized = requiredPermissions.some(p => !user?.permissions[p]);
        if (user && user.group === "PrivateCalendarAccess" && router.asPath !== "/intern/move-user") {
            router.push("/intern/move-user");
        }else if (unauthorized) {
            router.push('/login');
        }else if (!user) {
            router.push('/login');
        }
    }, [loaded]);
};