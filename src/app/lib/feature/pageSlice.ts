import { createSlice } from "@reduxjs/toolkit";

type PageState = {
  messageAlert: {
    alertType: "error" | "success" | "warning";
    message: string;
  } | null;
};

const initialState: PageState = {
  messageAlert: null,
};

const PageSlice = createSlice({
  name: "PageSlice",
  initialState,
  reducers: {
    setMessageAlert(state, action) {
      state.messageAlert = action.payload;
    },
  },
});

export const { setMessageAlert } = PageSlice.actions;

export default PageSlice.reducer;
