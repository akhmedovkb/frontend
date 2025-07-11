import React from 'react';
import { Navigate } from 'react-router-dom';

function ClientPrivateRoute({ children }) {
  const token = localStorage.getItem('clientToken');

  if (!token) {
    return <Navigate to="/client/login" />;
  }

  return children;
}

export default ClientPrivateRoute;
