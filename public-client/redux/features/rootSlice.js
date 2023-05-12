import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socket: null,
  user: null,
  theme: undefined,
  isLoginModalOpen: false,
  isCartOpen: false,
};

export const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    toggleTheme: (state, action) => {
      state.theme = action.payload;
    },
    setIsLoginModalOpen: (state, action) => {
      state.isLoginModalOpen = action.payload;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("radish_auth_token");
    },
    setIsCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    },
  },
});

export const {
  setSocket,
  setUser,
  toggleTheme,
  setIsLoginModalOpen,
  logout,
  setIsCartOpen,
} = rootSlice.actions;

export default rootSlice.reducer;
