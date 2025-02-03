import { createSlice } from "@reduxjs/toolkit";

type SchoolState = {
  semesterStartDate: string;
};

const initialState: SchoolState = {
  semesterStartDate: "Aug 01 2024",
};

const SchoolSlice = createSlice({
  name: "SchoolSlice",
  initialState,
  reducers: {},
});

export default SchoolSlice.reducer;
