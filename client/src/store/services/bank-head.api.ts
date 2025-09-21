//* file imports
import baseApi from "@/store/services/api";
import type { CreateBankHeadRequest, CreateBankHeadResponse, FetchBankHeadResponse, UpdateBankHeadRequest, UpdateBankHeadResponse } from "@/interfaces/bank-head.interface";

export const bankHeadApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBankHead: builder.mutation<CreateBankHeadResponse, CreateBankHeadRequest>({
            query: (payload) => ({
                url: "bank-head/create-bank-head",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["BankHead"],
        }),
        getAllBankHeads: builder.query<FetchBankHeadResponse, { agency_details?: boolean } | void>({
            query: (params) => {
                const queryString = params?.agency_details !== undefined
                    ? `?agency_details=${params.agency_details}`
                    : "";

                return {
                    url: `bank-head/fetch-bank-details${queryString}`,
                    method: "GET",
                };
            },
            providesTags: ["BankHead"],
        }),
        updateBankHead: builder.mutation<
            UpdateBankHeadResponse,
            { bank_head_id: string; payload: UpdateBankHeadRequest }
        >({
            query: ({ bank_head_id, payload }) => ({
                url: `bank-head/update-bank-head/${bank_head_id}`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: ["BankHead"],
        }),
    }),
});

export const {
    useCreateBankHeadMutation,
    useGetAllBankHeadsQuery,
    useUpdateBankHeadMutation
} = bankHeadApi;
