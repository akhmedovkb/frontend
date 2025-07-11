import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './pages/PrivateRoute';
import LoginClient from './pages/LoginClient';
import ClientDashboard from './pages/ClientDashboard';
import ClientPrivateRoute from './pages/ClientPrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/client-login" element={<LoginClient />} />
        <Route path="/client-dashboard" element={
          <ClientPrivateRoute><ClientDashboard /></ClientPrivateRoute>
        } />
        <Route path="*" element={<div className="text-center mt-10 text-xl">404 — Страница не найдена</div>} />
      </Routes>
    </Router>
  );
}

export default App;
