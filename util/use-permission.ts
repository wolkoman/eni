import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {Permission} from './verify';
import {useUserStore} from "@/store/UserStore";

export const usePermission = (requiredPermissions: Permission[] = []) => {
    const [user, loaded] = useUserStore(state => [state.user, state.loaded])
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
