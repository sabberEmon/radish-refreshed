import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socket: null,
  user: null,
  notifications: [],
  theme: undefined,
  actionWallet: null,
  actionWalletType: null,
  isLoginModalOpen: false,
  isCartOpen: false,
  isConnectWalletModalOpen: false,
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
    setIsConnectWalletModalOpen: (state, action) => {
      state.isConnectWalletModalOpen = action.payload;
    },
    setActionWallet: (state, action) => {
      state.actionWallet = action.payload;
    },
    setActionWalletType: (state, action) => {
      state.actionWalletType = action.payload;
    },

    // notifications
    appendNotification: (state, action) => {
      // state.notifications.push(action.payload);
      state.notifications = [action.payload, ...state.notifications];
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    deleteNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== action.payload
      );
    },
    markNotificationAsRead: (state, action) => {
      state.notifications = state.notifications.map((notification) => {
        if (notification._id === action.payload) {
          notification.isRead = true;
        }
        return notification;
      });

      state.notifications = [...state.notifications];
    },
    deleteAllNotifications: (state) => {
      state.notifications = [];
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications = state.notifications.map((notification) => {
        notification.isRead = true;
        return notification;
      });

      state.notifications = [...state.notifications];
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
  appendNotification,
  setNotifications,
  setIsConnectWalletModalOpen,
  setActionWallet,
  deleteNotification,
  markNotificationAsRead,
  deleteAllNotifications,
  markAllNotificationsAsRead,
  setActionWalletType,
} = rootSlice.actions;

export default rootSlice.reducer;
