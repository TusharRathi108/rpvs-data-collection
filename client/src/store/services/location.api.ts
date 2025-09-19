//* file import
import baseApi from "@/store/services/api";

const locationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchDistricts: builder.query<
            {
                status: boolean;
                message: string;
                httpCode: number;
                records: {
                    _id: string;
                    district_code: string;
                    district_name: string;
                }[];
            },
            string
        >({
            query: (state_code) => ({
                url: `/location/fetch-districts`,
                method: "GET",
                params: { state_code },
            }),
            providesTags: ["Location"],
        }),

        fetchBlocks: builder.query<
            any,
            { state_code: string; district_code: string }
        >({
            query: ({ state_code, district_code }) => ({
                url: `/location/fetch-blocks`,
                method: "GET",
                params: { state_code, district_code },
            }),
            providesTags: ["Location"],
        }),

        fetchConstituencies: builder.query<
            any,
            { state_code: string; district_code: string }
        >({
            query: ({ state_code, district_code }) => ({
                url: `/location/fetch-constituencies`,
                method: "GET",
                params: { state_code, district_code },
            }),
            providesTags: ["Location"],
        }),

        fetchPanchayats: builder.query<
            any,
            { district_code: string; block_code: string }
        >({
            query: ({ district_code, block_code }) => ({
                url: `/location/fetch-panchayats`,
                method: "GET",
                params: { district_code, block_code },
            }),
            providesTags: ["Location"],
        }),

        fetchVillages: builder.query<
            any,
            { district_code: string; block_code: string; panchayat_code: string }
        >({
            query: ({ district_code, block_code, panchayat_code }) => ({
                url: `/location/fetch-villages`,
                method: "GET",
                params: { district_code, block_code, panchayat_code },
            }),
            providesTags: ["Location"],
        }),

        fetchLocalBodyTypes: builder.query<
            {
                status: boolean;
                message: string;
                httpCode: number;
                records: {
                    _id: string;
                    local_body_type_code: string;
                    local_body_type_name: string;
                }[];
            },
            void
        >({
            query: () => ({
                url: `/location/fetch-local-body-list`,
                method: "GET",
            }),
            providesTags: ["Location"],
        }),

        fetchLocalBodies: builder.query<
            any,
            { district_code: string; local_body_type_code: string }
        >({
            query: ({ district_code, local_body_type_code }) => ({
                url: `/location/fetch-local-bodies`,
                method: "GET",
                params: { district_code, local_body_type_code },
            }),
            providesTags: ["Location"],
        }),

        fetchLocalBodyWards: builder.query<
            any,
            { district_code: string; local_body_type_code: string; local_body_code: string }
        >({
            query: ({ district_code, local_body_type_code, local_body_code }) => ({
                url: `/location/fetch-local-body-wards`,
                method: "GET",
                params: { district_code, local_body_type_code, local_body_code },
            }),
            providesTags: ["Location"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useFetchDistrictsQuery,
    useFetchBlocksQuery,
    useFetchConstituenciesQuery,
    useFetchPanchayatsQuery,
    useFetchVillagesQuery,
    useFetchLocalBodyTypesQuery,
    useFetchLocalBodiesQuery,
    useFetchLocalBodyWardsQuery,
} = locationApi;
