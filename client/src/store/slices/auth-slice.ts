//* package imports
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type User = {
    user_id: string;
    username: string;
    email: string;
    role_name: string;
    password_reset: boolean
    state_code: string;
    state_name: string;
    district_code: string;
    district_name: string;
    district: any
};

interface AuthState {
    user: User | null;
}

const initialState: AuthState = {
    user: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<Partial<User>>) => {
            const payload = action.payload;

            // console.log("LOG IN AUHT SLICE: ", payload)

            state.user = {
                user_id: payload.user_id!,
                username: payload.username!,
                email: payload.email!,
                role_name: payload.role_name!,
                password_reset: payload.password_reset!,
                district_code: payload.district_code!,
                district_name: payload.district_name!,
                state_code: "03",
                state_name: "Punjab",
                district: payload.district!

            };
        },
        clearUser: (state) => {
            state.user = null;
        }
    }
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;