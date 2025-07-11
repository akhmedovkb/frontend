import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('clientToken', data.token);
        navigate('/client-dashboard');
      } else {
        setError(data.error || 'Ошибка входа');
      }
    } catch (err) {
      console.error(err);
      setError('Ошибка сети');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl mb-4">Вход клиента</h2>
      <input type="email" placeholder="Email" className="w-full mb-2 p-2 border" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Пароль" className="w-full mb-2 p-2 border" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded">Войти</button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default LoginClient;
