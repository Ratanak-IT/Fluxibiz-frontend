
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { SessionResponse } from "@/lib/type/authType";

export const sessionApi = createApi({
    reducerPath: "sessionApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/auth" }),
    tagTypes: ["Session"],
    endpoints: (builder) => ({
        getSession: builder.query<SessionResponse, void>({
            query: () => ({ url: "/session", credentials: "include" }),
            providesTags: ["Session"],
        }),
    }),
});

export const { useGetSessionQuery } = sessionApi;