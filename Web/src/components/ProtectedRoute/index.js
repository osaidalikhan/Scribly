import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component }) => {
  const { isLogin } = useSelector((state) => state.authReducer);

  return isLogin ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
