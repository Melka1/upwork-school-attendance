import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EMutationStatus, EQueryStatus } from "../enums";
import httpRequest from "../httpRequest";
import { Parent } from "@prisma/client";

export type TParent = Parent & {
  students: {
    id: string;
    name: string;
  }[];
};

interface FetchParentProps {
  id: string;
}

export const fetchParent = createAsyncThunk(
  "fetchParent",
  async ({ id }: FetchParentProps): Promise<Parent> => {
    try {
      const response = await httpRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/parent/${id}`,
        {
          method: "GET",
        }
      );

      const parent: Parent = response.data;
      return parent;
    } catch (error) {
      throw error;
    }
  }
);

interface CreateParentsInput {
  name: string;
  phoneNumber: string;
}

export const createParents = createAsyncThunk(
  "createParents",
  async (input: CreateParentsInput): Promise<void> => {
    try {
      await httpRequest(`${process.env.NEXT_PUBLIC_API_URL}/parent`, {
        method: "POST",
        body: input,
      });
    } catch (error) {
      throw error;
    }
  }
);

type ParentState = {
  status: EQueryStatus;
  mutationStatus: EMutationStatus;
  parent: Parent | null;
  isAddParentModalOpen: boolean;
};

const initialState: ParentState = {
  status: "initial",
  mutationStatus: "initial",
  parent: null,
  isAddParentModalOpen: false,
};

const ParentSlice = createSlice({
  name: "ParentSlice",
  initialState,
  reducers: {
    resetParentState(state) {
      state.parent = null;
      state.status = "initial";
      state.mutationStatus = "initial";
    },
    setIsAddParentModalOpen(state, action) {
      state.isAddParentModalOpen = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchParent.fulfilled, (state, action) => {
        state.status = "success";
        state.parent = action.payload;
      })
      .addCase(fetchParent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchParent.rejected, (state) => {
        state.status = "error";
      })
      .addCase(createParents.fulfilled, (state) => {
        state.mutationStatus = "success";
      })
      .addCase(createParents.rejected, (state) => {
        state.mutationStatus = "error";
      })
      .addCase(createParents.pending, (state) => {
        state.mutationStatus = "saving";
      });
  },
});

export const { resetParentState, setIsAddParentModalOpen } =
  ParentSlice.actions;

export default ParentSlice.reducer;
