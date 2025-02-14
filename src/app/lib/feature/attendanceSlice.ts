import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EAttendanceStatus, EMutationStatus, EQueryStatus } from "../enums";
import httpRequest from "../httpRequest";
import { logger } from "../logger";
import { Attendance, AttendanceStatus } from "@prisma/client";
import { formatDateForCalendarRange } from "../utils";

interface CreateAttendanceProps {
  date?: string;
  status: EAttendanceStatus;
  studentId: string;
  attendanceId?: string;
}

export const createAttendance = createAsyncThunk(
  "createAttendance",
  async ({ date, status, studentId, attendanceId }: CreateAttendanceProps) => {
    try {
      await httpRequest(`${process.env.NEXT_PUBLIC_API_URL}/attendance`, {
        method: "POST",
        body: { dateTime: date, status, studentId, attendanceId },
      });

      logger.info("created attendance list");
    } catch (error) {
      logger.error("error fetching attendance list: ", error);
      throw error;
    }
  }
);

interface UpdateAttendancesInput {
  id: string;
  status: EAttendanceStatus;
}

export const updateAttendances = createAsyncThunk(
  "updateAttendances",
  async ({ id, status }: UpdateAttendancesInput): Promise<void> => {
    try {
      await httpRequest(`${process.env.NEXT_PUBLIC_API_URL}/attendance/${id}`, {
        method: "PUT",
        body: {
          status,
        },
      });
    } catch (error) {
      throw error;
    }
  }
);

interface FetchAttendanceFilter {
  studentId?: string;
  studentIds?: string[];
  status?: AttendanceStatus;
  date?: string;
  month?: string;
  year?: string;
  startDate?: string;
}

export const fetchAttendances = createAsyncThunk(
  "fetchAttendances",
  async ({
    studentId,
    status,
    date,
    month,
    year,
    startDate,
    studentIds,
  }: FetchAttendanceFilter): Promise<Attendance[]> => {
    const params = new URLSearchParams({
      ...(studentId && { studentId }),
      ...(studentIds && { studentIds: JSON.stringify(studentIds) }),
      ...(status && { status: status.toString() }),
      ...(date && { date }),
      ...(month && { month }),
      ...(year && { year }),
      ...(startDate && { startDate }),
    });

    try {
      const response = await httpRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/attendance?${params.toString()}`,
        {
          method: "GET",
        }
      );

      const attendances: Attendance[] = response.data;
      return attendances;
    } catch (error) {
      throw error;
    }
  }
);

type AttendanceState = {
  status: EQueryStatus;
  mutationStatus: EMutationStatus;
  attendances: Attendance[];
  chosenDate: string;
};

const initialState: AttendanceState = {
  status: "initial",
  mutationStatus: "initial",
  attendances: [],
  chosenDate: formatDateForCalendarRange(new Date()),
};

const AttendanceSlice = createSlice({
  name: "AttendanceSlice",
  initialState,
  reducers: {
    resetAttendanceState(state) {
      state.attendances = [];
      state.mutationStatus = "initial";
    },
    setChosenDate(state, action) {
      state.chosenDate = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAttendances.fulfilled, (state, action) => {
        state.status = "success";
        state.attendances = action.payload;
      })
      .addCase(fetchAttendances.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAttendances.rejected, (state) => {
        state.status = "error";
      })
      .addCase(createAttendance.fulfilled, (state) => {
        state.mutationStatus = "success";
      })
      .addCase(createAttendance.pending, (state) => {
        state.mutationStatus = "saving";
      })
      .addCase(createAttendance.rejected, (state) => {
        state.mutationStatus = "error";
      })
      .addCase(updateAttendances.fulfilled, (state) => {
        state.mutationStatus = "success";
      })
      .addCase(updateAttendances.rejected, (state) => {
        state.mutationStatus = "error";
      })
      .addCase(updateAttendances.pending, (state) => {
        state.mutationStatus = "saving";
      });
  },
});

export const { resetAttendanceState, setChosenDate } = AttendanceSlice.actions;

export default AttendanceSlice.reducer;
