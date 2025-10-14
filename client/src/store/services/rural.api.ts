//* package imports
import baseApi from "@/store/services/api";

//* file imports
import type {
    FetchPanchayatValues,
    CreatePanchayatRequest,
    UpdatePanchayatRequest,
    CreatePanchayatResponse,
    UpdatePanchayatResponse
} from "@/interfaces/panchayat.interface"

import type {
    CreateVillageRequest,
    CreateVillageResponse,
    FetchVillageValues,
    UpdateVillageRequest,
    UpdateVillageResponse
} from "@/interfaces/village.interface"

const ruralApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /*
        * PANCHAYAT 
        */
        fetchAllPanchayats: builder.query<FetchPanchayatValues, void>({
            query: () => ({
                url: "location/fetch-all-panchayats",
                method: "GET",
            }),
            providesTags: ["Panchayat"]
        }),

        createPanchayat: builder.mutation<CreatePanchayatResponse, CreatePanchayatRequest>({
            query: (payload) => ({
                url: "location/create-panchayat",
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["Panchayat"]
        }),

        updatePanchayat: builder.mutation<UpdatePanchayatResponse, { panchayat_id: string, payload: UpdatePanchayatRequest }>({
            query: ({ panchayat_id, payload }) => ({
                url: `location/update-panchayat/${panchayat_id}`,
                method: "PATCH",
                body: payload
            }),
            invalidatesTags: ["Panchayat"]
        }),

        /* 
        * VILLAGE
        */
        fetchAllVillages: builder.query<FetchVillageValues, void>({
            query: () => ({
                url: "location/fetch-all-villages",
                method: "GET"
            }),
            providesTags: ["Village"]
        }),

        createVillage: builder.mutation<CreateVillageResponse, CreateVillageRequest>({
            query: (payload) => ({
                url: "location/create-village",
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["Village"]
        }),

        updateVillage: builder.mutation<UpdateVillageResponse, { village_id: string, payload: UpdateVillageRequest }>({
            query: ({ village_id, payload }) => ({
                url: `location/update-village/${village_id}`,
                method: "PATCH",
                body: payload
            }),
            invalidatesTags: ["Village"]
        }),
    })
})

export const {
    useFetchAllPanchayatsQuery,
    useCreatePanchayatMutation,
    useUpdatePanchayatMutation,

    useFetchAllVillagesQuery,
    useCreateVillageMutation,
    useUpdateVillageMutation
} = ruralApi
