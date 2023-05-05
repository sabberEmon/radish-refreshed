import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["User", "Notifications", "Comments"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    // send cookies with every request from nextAuth
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("RADISH_AUTH_TOKEN");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // Nft
    fetchNftsWithFilters: builder.mutation({
      query: ({ page = 1, limit = 20, body }) => ({
        url: `/api/nft/with-filters?page=${page}&limit=${limit}`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useFetchNftsWithFiltersMutation } = apiSlice;
