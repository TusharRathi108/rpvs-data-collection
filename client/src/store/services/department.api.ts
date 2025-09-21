//* file imports
import baseApi from "@/store/services/api";
import type { CreateDepartmentRequest, CreateDepartmentResponse, FetchDepartmentResponse, UpdateDepartmentRequest, UpdateDepartmentResponse } from "@/interfaces/department.interface"

const departmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createDepartment: builder.mutation<CreateDepartmentResponse, CreateDepartmentRequest>({
            query: (payload) => ({
                url: "departments/create-department",
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["Department"]
        }),

        getAllDepartments: builder.query<FetchDepartmentResponse, void>({
            query: () => ({
                url: "departments/fetch-departments",
                method: "GET"
            }),
            providesTags: ["Department"]
        }),

        updateDepartment: builder.mutation<
            UpdateDepartmentResponse,
            { department_id: string; payload: UpdateDepartmentRequest }
        >({
            query: ({ department_id, payload }) => ({
                url: `departments/update-department/${department_id}`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["Department"],
        }),
    })
})

export const {
    useCreateDepartmentMutation,
    useGetAllDepartmentsQuery,
    useUpdateDepartmentMutation
} = departmentApi
