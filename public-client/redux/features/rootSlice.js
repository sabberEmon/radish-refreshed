import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socket: null,
  notifications: [],
  isNotificationOpen: false,
  user: null,
  theme: undefined,
  actionWallet: null,
  walletType: null,
  isWalletOpen: false,
};

export const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    toggleNotification: (state) => {
      state.isNotificationOpen = !state.isNotificationOpen;
    },
    closeNotification: (state) => {
      state.isNotificationOpen = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    toggleTheme: (state, action) => {
      state.theme = action.payload;
    },
    setActionWallet: (state, action) => {
      state.actionWallet = action.payload;
    },
    setIsWalletOpen: (state, action) => {
      state.isWalletOpen = action.payload;
    },
    setWalletType: (state, action) => {
      state.walletType = action.payload;
    },
  },
});

export const {
  setSocket,
  toggleNotification,
  setUser,
  toggleTheme,
  setActionWallet,
  setIsWalletOpen,
  setWalletType,
  closeNotification,
} = rootSlice.actions;

export default rootSlice.reducer;
