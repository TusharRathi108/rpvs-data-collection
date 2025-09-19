import baseApi from "@/store/services/api";
import type {
    CreateProposalRequest,
    CreateProposalResponse,
    FetchProposalResponse,
    UpdateProposalRequest,
    UpdateProposalResponse,
} from "@/interfaces/proposal.interface";

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
    }),
});

export const {
    useCreateProposalMutation,
    useGetAllProposalsQuery,
    useUpdateProposalMutation,
} = proposalApi;