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
        getBankHeadById: builder.query<FetchBankHeadResponse, string>({
            query: (bank_head_id) => ({
                url: `bank-head/fetch-single-bank-head-details/${bank_head_id}`,
                method: "GET",
            }),
            providesTags: ["BankHead"],
        }),
        getAllBankHeads: builder.query<FetchBankHeadResponse, void>({
            query: () => ({
                url: "bank-head/fetch-bank-details",
                method: "GET",
            }),
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
    useGetBankHeadByIdQuery,
    useGetAllBankHeadsQuery,
    useUpdateBankHeadMutation
} = bankHeadApi;
