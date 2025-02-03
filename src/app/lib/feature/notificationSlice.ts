import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { EMutationStatus, EQueryStatus } from "../enums";
import httpRequest from "../httpRequest";
import { Notification } from "@prisma/client";

interface FetchNotificationProps {
  isRead?: boolean;
  userId: string;
}

export type TNotification = Omit<Notification, "date"> & {
  recipientId: string;
  date: string;
};

export const fetchNotifications = createAsyncThunk(
  "fetchNotifications",
  async ({
    isRead,
    userId,
  }: FetchNotificationProps): Promise<TNotification[]> => {
    const params = new URLSearchParams({
      ...(isRead && { isRead: JSON.stringify(isRead) }),
    });
    try {
      const response = await httpRequest(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/notification/${userId}?${params.toString()}`,
        {
          method: "GET",
        }
      );

      const notifications: TNotification[] = response.data;
      return notifications;
    } catch (error) {
      throw error;
    }
  }
);

interface CreateNotificationInput {
  title: string;
  name: string;
}

export const createNotifications = createAsyncThunk(
  "createNotifications",
  async (input: CreateNotificationInput): Promise<void> => {
    try {
      await httpRequest(`${process.env.NEXT_PUBLIC_API_URL}/notification`, {
        method: "POST",
        body: input,
      });
    } catch (error) {
      throw error;
    }
  }
);

interface UpdateNotificationsInput {
  recipientId: string;
  isRead: boolean;
}

export const updateNotifications = createAsyncThunk(
  "updateNotifications",
  async (input: UpdateNotificationsInput): Promise<void> => {
    try {
      await httpRequest(`${process.env.NEXT_PUBLIC_API_URL}/notification`, {
        method: "PUT",
        body: input,
      });
    } catch (error) {
      throw error;
    }
  }
);

type NotificationState = {
  status: EQueryStatus;
  mutationStatus: EMutationStatus;

  notifications: TNotification[];
  isNotificationModalOpen: boolean;
};

const initialState: NotificationState = {
  status: "initial",
  mutationStatus: "initial",

  notifications: [],
  isNotificationModalOpen: false,
};

const NotificationSlice = createSlice({
  name: "NotificationSlice",
  initialState,
  reducers: {
    resetNotificationList(state) {
      state.notifications = [];
    },
    setIsNotificationModalOpen(state, action) {
      state.isNotificationModalOpen = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.status = "success";
      })
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.status = "error";
      })
      .addCase(createNotifications.fulfilled, (state) => {
        state.mutationStatus = "success";
      })
      .addCase(createNotifications.rejected, (state) => {
        state.mutationStatus = "error";
      })
      .addCase(createNotifications.pending, (state) => {
        state.mutationStatus = "saving";
      })
      .addCase(updateNotifications.fulfilled, (state) => {
        state.mutationStatus = "success";
      })
      .addCase(updateNotifications.rejected, (state) => {
        state.mutationStatus = "error";
      })
      .addCase(updateNotifications.pending, (state) => {
        state.mutationStatus = "saving";
      });
  },
});

export const { resetNotificationList, setIsNotificationModalOpen } =
  NotificationSlice.actions;

export default NotificationSlice.reducer;
