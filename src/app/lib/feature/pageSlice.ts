import { createSlice } from "@reduxjs/toolkit";

interface Alert {
  alertType: "error" | "success" | "warning";
  message: string;
}

type PageState = {
  messageAlert: Alert | null;
  currentPage: string;
};

const initialState: PageState = {
  messageAlert: null,
  currentPage: "",
};

const PageSlice = createSlice({
  name: "PageSlice",
  initialState,
  reducers: {
    setMessageAlert(state, action) {
      state.messageAlert = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
});

export const { setMessageAlert, setCurrentPage } = PageSlice.actions;

export default PageSlice.reducer;
