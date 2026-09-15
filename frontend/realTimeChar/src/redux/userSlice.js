import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",

  initialState: {
    userData: null,
    loading: true,
    otherUsers: null,
    selectedUser: null,
    socket: null,
    onlineUsers: [],
    searchData:null,
  },

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    },

    clearUserData: (state) => {
      state.otherUsers = null;
      state.userData = null;
      state.selectedUser = null;
      state.socket = null;
      state.onlineUsers = [];
      state.loading = false;
    },

    setOtherUsers: (state, action) => {
      state.loading = false;
      state.otherUsers = action.payload;
    },

    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    setSocket: (state, action) => {
      state.socket = action.payload;
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload;
    },
  },
});

export const {
  setUserData,
  clearUserData,
  setOtherUsers,
  setSelectedUser,
  setSocket,
  setOnlineUsers,setSearchData,
} = userSlice.actions;

export default userSlice.reducer;