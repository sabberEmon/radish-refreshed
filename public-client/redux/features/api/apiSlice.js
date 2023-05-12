import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["User", "Comments"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    // send cookies with every request from nextAuth
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("radish_auth_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },

    // handle errors
    // async onFetchError(error, { getState }) {
    //   if (error.status === 403 || error.status === 401) {
    //     // remove token from localStorage
    //     localStorage.removeItem("radish_auth_token");
    //   }
    // },
  }),

  endpoints: (builder) => ({
    // User
    authInfo: builder.query({
      query: () => "/api/auth",
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        // get data from endpoint
        const result = await queryFulfilled;

        // console.log(result);

        // if data.status is unauthorized, redirect to login page
        if (result.data.status === "unauthenticated") {
          dispatch({ type: "root/logout" });
        }

        // if data.status is authorized, set user data
        if (result.data.status === "authenticated") {
          dispatch({ type: "root/setUser", payload: result.data.data });
        }
      },
    }),
    getUserAccount: builder.query({
      query: () => "/api/user/my-account",
      providesTags: ["User"],
    }),
    addWallet: builder.mutation({
      query: (body) => ({
        url: "/api/user/wallets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    deleteWallet: builder.mutation({
      query: (body) => ({
        url: `/api/user/wallets/${body.wallet}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    editProfile: builder.mutation({
      query: (body) => ({
        url: "/api/user/edit-profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // Home
    fetchForSaleNfts: builder.query({
      query: () => "/api/nfts/for-sale",
    }),
    fetchAuctionedNfts: builder.query({
      query: () => "/api/nfts/on-auction",
    }),
  }),
});

export const {
  useAuthInfoQuery,
  useFetchForSaleNftsQuery,
  useFetchAuctionedNftsQuery,
  useGetUserAccountQuery,
  useAddWalletMutation,
  useDeleteWalletMutation,
  useEditProfileMutation,
} = apiSlice;
