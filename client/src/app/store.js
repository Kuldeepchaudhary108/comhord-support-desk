import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice.js";
import ticketReducer from "../features/tickets/ticketSlice.js";
import agentReducer from "../features/agents/agentSlice.js";
import dashboardReducer from "../features/dashboard/dashboardSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    agents: agentReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
