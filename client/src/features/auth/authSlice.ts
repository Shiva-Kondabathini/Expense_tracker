import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "./types/auth.types";
import {
  clearToken,
  clearUser,
  loadUser,
  saveUser,
} from "@/shared/utils/authStore";

const storedUser = loadUser();

const initialState: AuthState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;

      saveUser(action.payload);
    },
    logout: (state) => {
      state.user = null;

      state.isAuthenticated = false;
      clearUser();
      clearToken();
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
