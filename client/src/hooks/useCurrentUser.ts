//* package imports
import { useSelector } from "react-redux";

//* file imports
import type { RootState } from "@/store/store";

export const useCurrentUser = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const role_name = user?.role_name || "";

    return {
        user,
        role_name,
        isLoggedIn: Boolean(user?.user_id),
    };
};