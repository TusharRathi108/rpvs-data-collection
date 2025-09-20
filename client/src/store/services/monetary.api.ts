//* file imports
import baseApi from "@/store/services/api";
import { type IFetchIfscCodeResponse } from "@/interfaces/monetary.interface"

const ifscApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getIfscCodeById: builder.query<IFetchIfscCodeResponse, string>({
            query: (district_id) => ({
                url: `monetary/fetch-ifsc-code/${district_id}`,
                method: "GET"
            }),
            providesTags: ["IfscCode"]
        })
    })
})

export const { useGetIfscCodeByIdQuery } = ifscApi
