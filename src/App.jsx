// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RegistrationForm from './components/RegistrationForm'; // Поставщик
import Login from './pages/Login'; // Поставщик
import Dashboard from './pages/Dashboard'; // Поставщик
import PrivateRoute from './pages/PrivateRoute'; // Поставщик

import ClientRegister from './pages/ClientRegister'; // Клиент
import ClientLogin from './pages/ClientLogin'; // Клиент
import ClientDashboard from './pages/ClientDashboard'; // Клиент
import ClientPrivateRoute from './pages/ClientPrivateRoute'; // Клиент

function App() {
  return (
    <Router>
      <Routes>
        {/* Поставщики */}
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Клиенты */}
        <Route path="/client/register" element={<ClientRegister />} />
        <Route path="/client/login" element={<ClientLogin />} />
        <Route
          path="/client/dashboard"
          element={
            <ClientPrivateRoute>
              <ClientDashboard />
            </ClientPrivateRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="text-center mt-10 text-xl">
              404 — Страница не найдена
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
