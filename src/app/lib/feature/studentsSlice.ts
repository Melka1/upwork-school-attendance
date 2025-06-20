import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EMutationStatus, EQueryStatus } from "../enums";
import httpRequest from "../httpRequest";
import { Attendance } from "@prisma/client";

export type Student = {
  id: string;
  name: string;
  user: {
    email: string;
  };
  imageUrl?: string;
  phoneNumber: string;
  classroom: {
    name: string;
  };
  location: string;
  parent: {
    name: string;
    user: {
      email: string;
    };
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
  email?: string;
  imageUrl?: string;
  phoneNumber: string;
  classroom: string;
  location: string;
  parentName: string;
  parentEmail: string;
  parentPhoneNumber: string;
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
  name?: string;
  classroomId?: string;
  location?: string;
  phoneNumber?: string;
  emergencyContact?: string[];
  medicalInfo?: string[];
  imageUrl?: string;
}

export const updateStudents = createAsyncThunk(
  "updateStudents",
  async ({
    name,
    classroomId,
    id,
    location,
    phoneNumber,
    emergencyContact,
    medicalInfo,
    imageUrl,
  }: UpdateStudentProps): Promise<void> => {
    try {
      await httpRequest(`${process.env.NEXT_PUBLIC_API_URL}/student/${id}`, {
        method: "PUT",
        body: {
          name,
          classroomId,
          location,
          phoneNumber,
          emergencyContact,
          medicalInfo,
          imageUrl,
        },
      });
    } catch (error) {
      throw error;
    }
  }
);

interface DeleteStudentProp {
  id: string;
}

interface DeleteStudentResponse {
  id: string;
  name: string;
}

export const deleteStudents = createAsyncThunk(
  "deleteStudents",
  async ({ id }: DeleteStudentProp): Promise<void> => {
    try {
      await httpRequest(`${process.env.NEXT_PUBLIC_API_URL}/student/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      throw error;
    }
  }
);

type StudentState = {
  status: EQueryStatus;
  mutationStatus: EMutationStatus;
  deletionStatus: EMutationStatus;
  students: Student[];
  student: Student | null;
  isStudentDetailModalOpen: boolean;
  isAddStudentModalOpen: boolean;
  isDeleteStudentModalOpen: boolean;
  isEditing: boolean;
  studentIdToDelete: string | null;
};

const initialState: StudentState = {
  status: "initial",
  mutationStatus: "initial",
  deletionStatus: "initial",
  students: [],
  student: null,
  isStudentDetailModalOpen: false,
  isAddStudentModalOpen: false,
  isDeleteStudentModalOpen: false,
  isEditing: false,
  studentIdToDelete: null,
};

const StudentSlice = createSlice({
  name: "StudentSlice",
  initialState,
  reducers: {
    resetStudentList(state) {
      state.students = [];
    },
    resetStudent(state) {
      state.student = null;
    },
    setIsStudentDetailModalOpen(state, action) {
      state.isStudentDetailModalOpen = action.payload;
    },
    setIsDeleteStudentModalOpen(state, action) {
      state.isDeleteStudentModalOpen = action.payload;
    },
    setIsAddStudentModalOpen(state, action) {
      state.isAddStudentModalOpen = action.payload;
    },
    reInitializeState(state) {
      state.mutationStatus = "initial";
      state.status = "initial";
      state.deletionStatus = "initial";
    },
    setIsEditing(state, action) {
      state.isEditing = action.payload;
    },
    setStudentIdToDelete(state, action) {
      state.studentIdToDelete = action.payload;
    },
    resetMutationStatus(state) {
      state.mutationStatus = "initial";
    },
    resetDeletionStatus(state) {
      state.deletionStatus = "initial";
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
      })
      .addCase(deleteStudents.fulfilled, (state) => {
        state.deletionStatus = "success";
      })
      .addCase(deleteStudents.rejected, (state) => {
        state.deletionStatus = "error";
      })
      .addCase(deleteStudents.pending, (state) => {
        state.deletionStatus = "saving";
      });
  },
});

export const {
  resetStudentList,
  setIsStudentDetailModalOpen,
  setIsAddStudentModalOpen,
  reInitializeState,
  setIsEditing,
  resetStudent,
  setIsDeleteStudentModalOpen,
  setStudentIdToDelete,
  resetMutationStatus,
  resetDeletionStatus,
} = StudentSlice.actions;

export default StudentSlice.reducer;
