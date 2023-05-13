import { createSlice } from "@reduxjs/toolkit";

const collectionSlice = createSlice({
  name: "collection",
  initialState: {
    nfts: [],
    filters: [],
    page: 1,
    isFiltersOpen: false,
  },
  reducers: {
    setNfts: (state, action) => {
      state.nfts = action.payload;
    },
    apendNfts: (state, action) => {
      state.nfts = [...state.nfts, ...action.payload];
    },
    setFilters: (state, action) => {
      const tempFilters = state.filters;

      const { value } = action.payload.e.target;

      const targetedFilter = tempFilters.find(
        (filter) => filter.trait_type === action.payload.traitType.trait_type
      );

      if (targetedFilter) {
        if (targetedFilter.values.includes(value)) {
          targetedFilter.values = targetedFilter.values.filter(
            (val) => val !== value
          );
        } else {
          targetedFilter.values.push(value);
        }
      } else {
        tempFilters.push({
          trait_type: action.payload.traitType.trait_type,
          values: [value],
        });
      }

      // remove empty filters
      tempFilters.forEach((filter, index) => {
        if (filter.values.length === 0) {
          tempFilters.splice(index, 1);
        }
      });

      state.filters = tempFilters;
    },
    incrementPage: (state, action) => {
      state.page = state.page + 1;
    },
    setIsFiltersOpen: (state, action) => {
      state.isFiltersOpen = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const {
  setNfts,
  apendNfts,
  setFilters,
  incrementPage,
  setIsFiltersOpen,
  setPage,
} = collectionSlice.actions;

export default collectionSlice.reducer;
