import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../services/api.js";

export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async (params = {}, thunkAPI) => {
    try {
      const response = await api.get("/tickets", { params });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch tickets"
      );
    }
  }
);

export const fetchTicket = createAsyncThunk(
  "tickets/fetchTicket",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/tickets/${id}`);
      const ticket =
        response.data?.data?.ticket ||
        response.data?.ticket ||
        response.data?.data ||
        response.data;
      return ticket;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch ticket"
      );
    }
  }
);

export const createTicket = createAsyncThunk(
  "tickets/createTicket",
  async (ticketData, thunkAPI) => {
    try {
      const response = await api.post("/tickets", ticketData);
      return response.data.data.ticket;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create ticket"
      );
    }
  }
);

export const updateTicket = createAsyncThunk(
  "tickets/updateTicket",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.patch(`/tickets/${id}`, data);
      return response.data.data.ticket;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update ticket"
      );
    }
  }
);

export const assignTicket = createAsyncThunk(
  "tickets/assignTicket",
  async ({ id, agentId }, thunkAPI) => {
    try {
      const response = await api.patch(`/tickets/${id}/assign`, { agentId });
      return response.data.data.ticket;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to assign ticket"
      );
    }
  }
);

export const addReply = createAsyncThunk(
  "tickets/addReply",
  async ({ id, content, type = "public" }, thunkAPI) => {
    try {
      const response = await api.post(`/tickets/${id}/replies`, {
        content,
        type,
      });
      return response.data.data.ticket;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add reply"
      );
    }
  }
);

const initialState = {
  items: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  loading: false,
  detailsLoading: false,
  currentTicket: null,
  error: null,
};

const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    clearTicketError: (state) => {
      state.error = null;
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.tickets || [];
        state.pagination = action.payload?.pagination || state.pagination;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTicket.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchTicket.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.currentTicket = action.payload;
      })
      .addCase(fetchTicket.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.currentTicket = action.payload;
        const index = state.items.findIndex(
          (item) => item._id === action.payload?._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(assignTicket.fulfilled, (state, action) => {
        state.currentTicket = action.payload;
        const index = state.items.findIndex(
          (item) => item._id === action.payload?._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(addReply.fulfilled, (state, action) => {
        state.currentTicket = action.payload;
      });
  },
});

export const { clearTicketError, clearCurrentTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
