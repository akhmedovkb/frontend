import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './pages/PrivateRoute';
import ClientRegister from './pages/ClientRegister';
import ClientLogin from './pages/ClientLogin';
import ClientDashboard from './pages/ClientDashboard';
import ClientPrivateRoute from './pages/ClientPrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
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

        {/* Страница 404 */}
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
