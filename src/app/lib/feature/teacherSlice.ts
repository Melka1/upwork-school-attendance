import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EMutationStatus, EQueryStatus } from "../enums";
import httpRequest from "../httpRequest";
import { Teacher } from "@prisma/client";

interface FetchTeacherProps {
  id: string;
}

export const fetchTeacher = createAsyncThunk(
  "fetchTeacher",
  async ({ id }: FetchTeacherProps): Promise<Teacher> => {
    try {
      const response = await httpRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/teacher/${id}`,
        {
          method: "GET",
        }
      );

      const teacher: Teacher = response.data;
      return teacher;
    } catch (error) {
      throw error;
    }
  }
);

interface CreateTeachersInput {
  name: string;
  email: string;
  phoneNumber: string;
  imageUrl?: string;
}

export const createTeachers = createAsyncThunk(
  "createTeachers",
  async (input: CreateTeachersInput): Promise<void> => {
    try {
      await httpRequest(`${process.env.NEXT_PUBLIC_API_URL}/teacher`, {
        method: "POST",
        body: input,
      });
    } catch (error) {
      throw error;
    }
  }
);

type TeacherState = {
  status: EQueryStatus;
  mutationStatus: EMutationStatus;
  teacher: Teacher | null;
  isAddTeacherModalOpen: boolean;
};

const initialState: TeacherState = {
  status: "initial",
  mutationStatus: "initial",
  teacher: null,
  isAddTeacherModalOpen: false,
};

const TeacherSlice = createSlice({
  name: "TeacherSlice",
  initialState,
  reducers: {
    resetTeacherState(state) {
      state.teacher = null;
      state.status = "initial";
      state.mutationStatus = "initial";
    },
    setIsAddTeacherModalOpen(state, action) {
      state.isAddTeacherModalOpen = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTeacher.fulfilled, (state, action) => {
        state.status = "success";
        state.teacher = action.payload;
      })
      .addCase(fetchTeacher.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTeacher.rejected, (state) => {
        state.status = "error";
      })
      .addCase(createTeachers.fulfilled, (state) => {
        state.mutationStatus = "success";
      })
      .addCase(createTeachers.rejected, (state) => {
        state.mutationStatus = "error";
      })
      .addCase(createTeachers.pending, (state) => {
        state.mutationStatus = "saving";
      });
  },
});

export const { resetTeacherState, setIsAddTeacherModalOpen } =
  TeacherSlice.actions;

export default TeacherSlice.reducer;
