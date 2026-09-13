import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLogin: false,
  access_token: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    saveLoginUserData(state, action) {
      state.user = action.payload.user;
      state.access_token = action.payload.token;
      state.isLogin = true;
    },
    logoutUser(state, action) {
      state.user = null;
      state.access_token = null;
      state.isLogin = false;
    },
  },
});
export const { saveLoginUserData, logoutUser } = authSlice.actions;
export default authSlice.reducer;
