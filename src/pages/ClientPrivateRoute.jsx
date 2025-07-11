import React from 'react';
import { Navigate } from 'react-router-dom';

function ClientPrivateRoute({ children }) {
  const token = localStorage.getItem('clientToken');
  return token ? children : <Navigate to="/client-login" />;
}

export default ClientPrivateRoute;
