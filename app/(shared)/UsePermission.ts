import {useUserStore} from "@/store/UserStore";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {Permission} from "@/domain/users/Permission";
import {Links} from "@/app/(shared)/Links";

export const usePermission = (requiredPermissions: Permission[] = []) => {
    const [user, loaded] = useUserStore(state => [state.user, state.loaded])
    const router = useRouter();
    useEffect(() => {
        if (!loaded) return;
        const unauthorized = requiredPermissions.some(p => !user?.permissions[p]);
        if (unauthorized) {
            router.push(Links.Login);
        } else if (!user) {
            router.push(Links.Hauptseite);
        }
    }, [loaded, user]);
};
