import RegistrationForm from './components/RegistrationForm';

function App() {
  return (
    <div>
      <h1>Регистрация поставщика</h1>
      <RegistrationForm />
    </div>
  );
}

export default App;

// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './modules/auth/Login';

<Router>
  <Routes>
    <Route path="/login" element={<Login />} />
    {/* другие маршруты */}
  </Routes>
</Router>
