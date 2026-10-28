import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../services/api.js";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await api.post(
        "/auth/login",
        credentials
      );

      const { user, accessToken } =
        response.data.data;

      localStorage.setItem(
        "accessToken",
        accessToken
      );

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  }
);

export const getCurrentUser =
  createAsyncThunk(
    "auth/me",
    async (_, thunkAPI) => {
      try {
        const response =
          await api.get("/auth/me");

        return response.data.data.user;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          "Session expired"
        );
      }
    }
  );

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Clear local session even if API fails.
    }

    localStorage.removeItem(
      "accessToken"
    );
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    initialized: (state) => {
      state.initialized = true;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase("auth/initialized", (state) => {
        state.initialized = true;
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        login.fulfilled,
        (state, action) => {
          state.loading = false;
          state.user = action.payload;
          state.isAuthenticated = true;
          state.initialized = true;
        }
      )

      .addCase(
        login.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      .addCase(
        getCurrentUser.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        getCurrentUser.fulfilled,
        (state, action) => {
          state.loading = false;
          state.initialized = true;
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      )

      .addCase(
        getCurrentUser.rejected,
        (state) => {
          state.loading = false;
          state.initialized = true;
          state.user = null;
          state.isAuthenticated = false;
        }
      )

      .addCase(
        logout.fulfilled,
        (state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.loading = false;
          state.initialized = true;
        }
      );
  },
});

export const {
  clearAuthError,
  initialized,
} = authSlice.actions;

export default authSlice.reducer;
