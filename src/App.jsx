// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
import PrivateRoute from './pages/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<div>404 — Страница не найдена</div>} />
      </Routes>
    </Router>
  );
}

export default App;
