import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import httpRequest from "../httpRequest";
import { User, UserType } from "@prisma/client";
import { EMutationStatus, EQueryStatus } from "../enums";

type TUser = User & {
  student: {
    id: string;
    name: string;
  };
  teacher: {
    id: string;
    name: string;
  };
};

interface FetchUsersProps {
  email: string;
}

export const fetchUsers = createAsyncThunk(
  "fetchUsers",
  async ({ email }: FetchUsersProps): Promise<TUser> => {
    try {
      const response = await httpRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/user?email=${email}`,
        {
          method: "GET",
        }
      );

      const user = response.data;
      return user;
    } catch (error) {
      throw error;
    }
  }
);

interface CreateUsersInput {
  email: string;
  userType?: UserType;
}

export const createUsers = createAsyncThunk(
  "createUsers",
  async ({ email, userType }: CreateUsersInput): Promise<TUser> => {
    try {
      const response = await httpRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/user`,
        {
          method: "POST",
          body: { email, userType: userType || UserType.STUDENT },
        }
      );

      const user = response.data.user;
      return user;
    } catch (error) {
      throw error;
    }
  }
);

interface UpdateUsersInput {
  id: string;
  userType: UserType;
}

export const updateUsers = createAsyncThunk(
  "updateUsers",
  async ({ id, userType }: UpdateUsersInput): Promise<void> => {
    try {
      await httpRequest(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: "PUT",
        body: { id, userType },
      });
    } catch (error) {
      throw error;
    }
  }
);

type UserState = {
  user: TUser | null;
  queryStatus: EQueryStatus;
  mutationStatus: EMutationStatus;
};

const initialState: UserState = {
  user: null,
  queryStatus: "initial",
  mutationStatus: "initial",
};

const UserSlice = createSlice({
  name: "UserSlice",
  initialState,
  reducers: {
    resetUserState(state) {
      state.user = null;
      state.queryStatus = "initial";
      state.mutationStatus = "initial";
    },
  },
  extraReducers(builder) {
    builder.addCase(createUsers.rejected, (state) => {
      state.mutationStatus = "error";
    });
    builder.addCase(createUsers.pending, (state) => {
      state.mutationStatus = "saving";
    });
    builder.addCase(createUsers.fulfilled, (state, action) => {
      state.mutationStatus = "success";
      state.user = action.payload;
    });
    builder.addCase(updateUsers.rejected, (state) => {
      state.mutationStatus = "error";
    });
    builder.addCase(updateUsers.pending, (state) => {
      state.mutationStatus = "saving";
    });
    builder.addCase(updateUsers.fulfilled, (state) => {
      state.mutationStatus = "success";
    });
    builder.addCase(fetchUsers.rejected, (state) => {
      state.queryStatus = "error";
    });
    builder.addCase(fetchUsers.pending, (state) => {
      state.queryStatus = "loading";
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.queryStatus = "success";
      state.user = action.payload;
    });
  },
});

export const { resetUserState } = UserSlice.actions;

export default UserSlice.reducer;
