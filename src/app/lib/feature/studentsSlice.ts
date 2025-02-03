import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EMutationStatus, EQueryStatus } from "../enums";
import httpRequest from "../httpRequest";
import { Attendance } from "@prisma/client";

export type Student = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  phoneNumber: string;
  classroom: {
    name: string;
  };
  location: string;
  parent: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  medicalInfo: string[];
  emergencyContact: string[];
  attendance: Attendance[];
  notifications: Notification[];
};

interface FetchStudentProps {
  id: string;
}

export const fetchStudent = createAsyncThunk(
  "fetchStudent",
  async ({ id }: FetchStudentProps): Promise<Student> => {
    try {
      const response = await httpRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/student/${id}`,
        {
          method: "GET",
        }
      );

      const student: Student = response.data;
      return student;
    } catch (error) {
      throw error;
    }
  }
);

interface FetchStudentsProps {
  classroom?: string;
}

export const fetchStudents = createAsyncThunk(
  "fetchStudents",
  async ({ classroom }: FetchStudentsProps): Promise<Student[]> => {
    const params = new URLSearchParams({
      ...(classroom && { classroom }),
    });
    try {
      const response = await httpRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/student?${params.toString()}`,
        {
          method: "GET",
        }
      );

      const students: Student[] = response.data;
      return students;
    } catch (error) {
      throw error;
    }
  }
);

interface CreateStudentsInput {
  name: string;
  email: string;
  imageUrl?: string;
  phoneNumber: string;
  classroom: string;
  location: string;
  parent: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  medicalInfo: string[];
  emergencyContact: string[];
}

export const createStudents = createAsyncThunk(
  "createStudents",
  async (input?: CreateStudentsInput): Promise<void> => {
    try {
      await httpRequest(`${process.env.NEXT_PUBLIC_API_URL}/student`, {
        method: "POST",
        body: { ...input, classroomId: input.classroom },
      });
    } catch (error) {
      throw error;
    }
  }
);

interface UpdateStudentProps {
  id: string;
  name: string;
  classroomId: string;
}

export const updateStudents = createAsyncThunk(
  "updateStudents",
  async ({ name, classroomId, id }: UpdateStudentProps): Promise<void> => {
    try {
      await httpRequest(`${process.env.NEXT_PUBLIC_API_URL}/student/${id}`, {
        method: "PUT",
        body: { name, classroomId },
      });
    } catch (error) {
      throw error;
    }
  }
);

type StudentState = {
  status: EQueryStatus;
  mutationStatus: EMutationStatus;
  students: Student[];
  student: Student | null;
  isStudentDetailModalOpen: boolean;
  isAddStudentModalOpen: boolean;
};

const initialState: StudentState = {
  status: "initial",
  mutationStatus: "initial",
  students: [],
  student: null,
  isStudentDetailModalOpen: false,
  isAddStudentModalOpen: false,
};

const StudentSlice = createSlice({
  name: "StudentSlice",
  initialState,
  reducers: {
    resetStudentList(state) {
      state.students = [];
    },
    setIsStudentDetailModalOpen(state, action) {
      state.isStudentDetailModalOpen = action.payload;
    },
    setIsAddStudentModalOpen(state, action) {
      state.isAddStudentModalOpen = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.students = action.payload;
        state.status = "success";
      })
      .addCase(fetchStudents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStudents.rejected, (state) => {
        state.status = "error";
      })
      .addCase(fetchStudent.fulfilled, (state, action) => {
        state.status = "success";
        state.student = action.payload;
      })
      .addCase(fetchStudent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStudent.rejected, (state) => {
        state.status = "error";
      })
      .addCase(createStudents.fulfilled, (state) => {
        state.mutationStatus = "success";
      })
      .addCase(createStudents.rejected, (state) => {
        state.mutationStatus = "error";
      })
      .addCase(createStudents.pending, (state) => {
        state.mutationStatus = "saving";
      })
      .addCase(updateStudents.fulfilled, (state) => {
        state.mutationStatus = "success";
      })
      .addCase(updateStudents.rejected, (state) => {
        state.mutationStatus = "error";
      })
      .addCase(updateStudents.pending, (state) => {
        state.mutationStatus = "saving";
      });
  },
});

export const {
  resetStudentList,
  setIsStudentDetailModalOpen,
  setIsAddStudentModalOpen,
} = StudentSlice.actions;

export default StudentSlice.reducer;
