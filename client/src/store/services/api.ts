//* package imports
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000/api/v1",
        credentials: "include",
    }),
    tagTypes: ["BudgetHead", "BankHead", "User", "Project", "Proposal", "Location", "MLA", "Sector", "SubSectorWork"],
    endpoints: () => ({}),
});

export default baseApi
