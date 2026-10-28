import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const location = useLocation();

  const {
    isAuthenticated,
    initialized,
    loading,
  } = useSelector(
    (state) => state.auth
  );

  if (!initialized || loading) {
    return (
      <div className="page-loader">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;