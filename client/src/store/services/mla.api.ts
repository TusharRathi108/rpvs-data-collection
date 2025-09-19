//* file imports
import type { FetchMlaResponse } from "@/interfaces/mla.interface";
import baseApi from "@/store/services/api";

export const mlaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchMlas: builder.query<FetchMlaResponse, void>({
            query: () => ({
                url: "/users/mla/fetch-mla",
                method: "GET",
            }),
            providesTags: ["MLA"],
        }),
    }),
});

export const { useFetchMlasQuery } = mlaApi;