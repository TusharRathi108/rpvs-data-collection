//* file imports
import baseApi from "@/store/services/api";
import type {
    CreateBudgetHeadRequest,
    CreateBudgetHeadResponse,
    FetchBudgetHeadResponse,
    FetchSingleBudgetHeadResponse,
    UpdateBudgetHeadRequest,
    UpdateBudgetHeadResponse,
} from "@/interfaces/budget-head.interface";

export const budgetHeadApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBudgetHead: builder.mutation<CreateBudgetHeadResponse, CreateBudgetHeadRequest>({
            query: (payload) => ({
                url: "/budget-head/create-budget-head",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["BudgetHead"],
        }),

        getAllBudgetHeads: builder.query<FetchBudgetHeadResponse, void>({
            query: () => ({
                url: "/budget-head/fetch-budget-head-details",
                method: "GET",
            }),
            providesTags: ["BudgetHead"],
        }),

        getBudgetHeadById: builder.query<FetchSingleBudgetHeadResponse, string>({
            query: (budget_head_id) => ({
                url: `/budget-head/fetch-single-budget-head-details/${budget_head_id}`,
                method: "GET",
            }),
            providesTags: ["BudgetHead"],
        }),

        // 🔹 New update mutation
        updateBudgetHead: builder.mutation<
            UpdateBudgetHeadResponse,
            UpdateBudgetHeadRequest
        >({
            query: ({ budget_head_id, ...payload }) => ({
                url: `/budget-head/update-budget-head/${budget_head_id}`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: ["BudgetHead"],
        }),
    }),
});

//* auto-generated hooks
export const {
    useCreateBudgetHeadMutation,
    useGetAllBudgetHeadsQuery,
    useGetBudgetHeadByIdQuery,
    useUpdateBudgetHeadMutation, // 👈 new hook
} = budgetHeadApi;