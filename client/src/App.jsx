import { useEffect } from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import { getCurrentUser } from "./features/auth/authSlice.js";

import ProtectedRoute from "./routes/protectedRoute.jsx";

import Layout from "./components/layout/layout.jsx";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tickets from "./pages/Tickets.jsx";
import CreateTicket from "./pages/CreateTicket.jsx";
import TicketDetails from "./pages/TicketDetails.jsx";
import Agents from "./pages/Agents.jsx";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      dispatch(getCurrentUser());
    } else {
      dispatch({
        type: "auth/initialized",
      });
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/tickets" element={<Tickets />} />

          <Route path="/tickets/new" element={<CreateTicket />} />

          <Route path="/tickets/:id" element={<TicketDetails />} />

          <Route path="/agents" element={<Agents />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
