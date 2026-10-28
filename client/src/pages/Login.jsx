import { useEffect, useState } from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  login,
  clearAuthError,
} from "../features/auth/authSlice.js";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isAuthenticated,
    loading,
    error,
  } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result =
      await dispatch(login(form));

    if (
      login.fulfilled.match(result)
    ) {
      navigate(
        "/dashboard",
        { replace: true }
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="brand-mark">
            SD
          </span>

          <h1>Support Desk</h1>

          <p>
            Sign in to manage customer
            tickets.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="form"
        >
          <div className="field">
            <label>Email</label>

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="agent@company.com"
              required
            />
          </div>

          <div className="field">
            <label>Password</label>

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          <button
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;