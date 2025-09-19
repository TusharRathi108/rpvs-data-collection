//* file imports
import baseApi from "@/store/services/api";
import type { FetchSectorsResponse, FetchSubSectorWorksResponse } from "@/interfaces/sector.interface";

export const sectorApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllSectors: builder.query<FetchSectorsResponse, void>({
            query: () => ({
                url: "/sectors/get-all-sectors",
                method: "GET",
            }),
            providesTags: ["Sector"],
        }),

        getSubSectorWorks: builder.query<
            FetchSubSectorWorksResponse,
            { sector: string; subSector?: string }
        >({
            query: ({ sector, subSector }) => ({
                url: "/sectors/get-subsector-works",
                method: "GET",
                params: { sector, subSector },
            }),
        }),
    }),
});

export const { useGetAllSectorsQuery, useGetSubSectorWorksQuery } = sectorApi;