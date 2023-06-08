import { createSlice } from "@reduxjs/toolkit";

const initialUiState = {
  isCartVisible: false,
  notification: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    toggleCart(state) {
      state.isCartVisible = !state.isCartVisible;
    },
    showNotification(state, action) {
      //status에는 보류(pending), 에러(error), 성공(success)
      state.notification = {
        status: action.payload.status,
        title: action.payload.title,
        message: action.payload.message,
      };
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
