import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  activeRequests: number;
}

const initialState: UiState = {
  activeRequests: 0,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    startRequest: (state) => {
      state.activeRequests += 1;
    },
    finishRequest: (state) => {
      state.activeRequests = Math.max(0, state.activeRequests - 1);
    },
  },
});

export const { startRequest, finishRequest } = uiSlice.actions;

export default uiSlice.reducer;
