import baseApi from "@/store/services/api";
import type {
    CreateProposalRequest,
    CreateProposalResponse,
    FetchProposalResponse,
    UpdateProposalRequest,
    UpdateProposalResponse,
} from "@/interfaces/proposal.interface";
import type { DistrictProposalStatsResponse } from "@/interfaces/stats.interface";

export const proposalApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createProposal: builder.mutation<CreateProposalResponse, CreateProposalRequest>({
            query: (payload) => ({
                url: "/proposals/create-proposal",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Proposal"],
        }),

        getAllProposals: builder.query<FetchProposalResponse, void>({
            query: () => ({
                url: "/proposals/fetch-proposals",
                method: "GET",
            }),
            providesTags: ["Proposal"],
        }),
        updateProposal: builder.mutation<
            UpdateProposalResponse,
            { proposal_id: string } & UpdateProposalRequest
        >({
            query: ({ proposal_id, ...payload }) => ({
                url: `/proposals/update-proposal/${proposal_id}`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["Proposal"],
        }),
        getDistrictWiseProposalCount: builder.query<DistrictProposalStatsResponse, void>({
            query: () => ({
                url: "/public/porposal-district-wise-count",
                method: "GET",
            }),
            providesTags: ["Proposal"],
        }),
    }),
});

export const {
    useCreateProposalMutation,
    useGetAllProposalsQuery,
    useUpdateProposalMutation,
    useGetDistrictWiseProposalCountQuery
} = proposalApi;