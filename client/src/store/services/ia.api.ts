//* package imports
import baseApi from "@/store/services/api";

//* file imports
import type {
    CreateImplementationAgencyRequest,
    CreateImplementationAgencyResponse,
    FetchImplementationAgencyResponse,
    UpdateImplementationAgencyRequest,
    UpdateImplementationAgencyResponse,
} from "@/interfaces/ia.interface";

const iaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createImplementationAgency: builder.mutation<
            CreateImplementationAgencyResponse,
            CreateImplementationAgencyRequest
        >({
            query: (payload) => ({
                url: "implementation-agency/create-ia",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["ImplementationAgency"],
        }),

        getAllImplementationAgencies: builder.query<
            FetchImplementationAgencyResponse,
            void
        >({
            query: () => ({
                url: "implementation-agency/fetch-ia",
                method: "GET",
            }),
            providesTags: ["ImplementationAgency"],
        }),

        getImplementationAgenciesDistrictWise: builder.query<
            FetchImplementationAgencyResponse,
            string
        >({
            query: (district_id) => ({
                url: `implementation-agency/fetch-ia-district-wise/${district_id}`,
                method: "GET",
            }),
            providesTags: ["ImplementationAgency"],
        }),

        updateImplementationAgency: builder.mutation<
            UpdateImplementationAgencyResponse,
            { agency_id: string; payload: UpdateImplementationAgencyRequest }
        >({
            query: ({ agency_id, payload }) => ({
                url: `implementation-agency/update-ia/${agency_id}`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["ImplementationAgency"],
        }),
    }),
});

export const {
    useCreateImplementationAgencyMutation,
    useGetAllImplementationAgenciesQuery,
    useGetImplementationAgenciesDistrictWiseQuery,
    useUpdateImplementationAgencyMutation,
} = iaApi;