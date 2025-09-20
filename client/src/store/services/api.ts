//* package imports
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: "include",
    }),
    tagTypes: ["BudgetHead", "IfscCode", "BankHead", "User", "Project", "Proposal", "Location", "MLA", "Sector", "SubSectorWork"],
    endpoints: () => ({}),
});

export default baseApi
