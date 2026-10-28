import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../services/api.js";

export const fetchAgents = createAsyncThunk(
  "agents/fetchAgents",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/agents");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch agents"
      );
    }
  }
);

export const createAgent = createAsyncThunk(
  "agents/createAgent",
  async (agentData, thunkAPI) => {
    try {
      const response = await api.post("/agents", agentData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create agent"
      );
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const agentSlice = createSlice({
  name: "agents",
  initialState,
  reducers: {
    clearAgentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAgent.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items.push(action.payload);
        }
      })
      .addCase(createAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAgentError } = agentSlice.actions;
export default agentSlice.reducer;
