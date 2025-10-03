//* package imports
import { z } from "zod";

//* file imports
import baseApi from "@/store/services/api";
import type { LoginSchema } from "@/schemas/login-form.schema";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<
            { records: any; message: string },
            z.infer<typeof LoginSchema>
        >({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body: {
                    username: body.username,
                    password: body.password
                },
            }),
        }),
        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),
        resetPassword: builder.mutation<
            { records: any; message: string },
            { username: string; password: string; newPassword: string }
        >({
            query: (body) => ({
                url: "/reset/password",
                method: "POST",
                body,
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useLoginMutation, useLogoutMutation, useResetPasswordMutation } = authApi;
