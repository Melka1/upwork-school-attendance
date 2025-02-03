import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EQueryStatus } from "../enums";
import { Classroom } from "@prisma/client";
import httpRequest from "../httpRequest";

interface FetchClassroomsProps {
  name?: string;
}

export const fetchClassrooms = createAsyncThunk(
  "fetchClassrooms",
  async ({ name }: FetchClassroomsProps) => {
    const params = new URLSearchParams({
      ...(name && { name }),
    });
    try {
      const response = await httpRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/classroom?${params.toString()}`,
        {
          method: "GET",
        }
      );

      const classrooms: Classroom[] = response.data;
      return classrooms;
    } catch (error) {
      throw error;
    }
  }
);

type ClassroomState = {
  status: EQueryStatus;
  classroom: Classroom | null;
  classrooms: Classroom[];
};

const initialState: ClassroomState = {
  status: "initial",
  classroom: null,
  classrooms: [],
};

const ClassroomSlice = createSlice({
  name: "ClassroomSlice",
  initialState,
  reducers: {
    resetClassroomList(state) {
      state.classroom = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchClassrooms.fulfilled, (state, action) => {
        state.classrooms = action.payload;
        state.status = "success";
      })
      .addCase(fetchClassrooms.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchClassrooms.rejected, (state) => {
        state.status = "error";
      });
  },
});

export const { resetClassroomList } = ClassroomSlice.actions;

export default ClassroomSlice.reducer;
