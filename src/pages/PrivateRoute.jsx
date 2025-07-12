import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("providerToken");
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
