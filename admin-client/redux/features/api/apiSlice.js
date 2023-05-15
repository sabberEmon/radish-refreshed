import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Collections", "Nfts", "Admins"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("RADSIH_ADMIN_AUTH_TOKEN");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCollections: builder.query({
      query: () => "/api/collection/get-collections",
      providesTags: ["Collections"],
    }),
    addCollection: builder.mutation({
      query: (body) => ({
        url: "/api/collection/create-collection",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Collections"],
    }),
    editNft: builder.mutation({
      query: (body) => ({
        url: "/api/nft/edit-nft",
        method: "POST",
        body,
      }),
    }),
    markAsEditorsPick: builder.mutation({
      query: (body) => ({
        url: "/api/nft/mark-as-editors-pick",
        method: "POST",
        body,
      }),
    }),
    addAdminToWhitelist: builder.mutation({
      query: (body) => ({
        url: "/api/admin/auth/whitelist",
        method: "POST",
        body,
      }),
    }),
    verifyWHitelistRequest: builder.mutation({
      query: (body) => ({
        url: "/api/admin/auth/verify-whitelist",
        method: "POST",
        body,
      }),
    }),
    editCollection: builder.mutation({
      query: (body) => ({
        url: "/api/collection/edit-collection",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Collections"],
    }),
    modifyJsonDataFile: builder.mutation({
      query: (body) => ({
        url: "/api/collection/modify-json-data-file",
        method: "POST",
        body,
      }),
    }),
    deleteCollection: builder.mutation({
      query: ({ collectionIdentifier }) => ({
        url: "/api/collection/delete-collection/" + collectionIdentifier,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Collections"],
    }),
    deleteCollectionNfts: builder.mutation({
      query: ({ collectionIdentifier }) => ({
        url: "/api/collection/delete-collection-nfts/" + collectionIdentifier,
        method: "POST",
        body: {},
      }),
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useAddCollectionMutation,
  useDeleteCollectionMutation,
  useEditNftMutation,
  useMarkAsEditorsPickMutation,
  useAddAdminToWhitelistMutation,
  useVerifyWHitelistRequestMutation,
  useEditCollectionMutation,
  useModifyJsonDataFileMutation,
  useDeleteCollectionNftsMutation,
} = apiSlice;
