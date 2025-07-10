import React, { useState } from 'react';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('https://travella-production.up.railway.app/api/providers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('Успешный вход!');
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Ошибка авторизации');
      }
    } catch (err) {
      console.error(err);
      setError('Ошибка при соединении с сервером');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold">Вход для поставщика</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Пароль"
        className="w-full p-2 border rounded"
        value={formData.password}
        onChange={handleChange}
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Войти</button>
    </form>
  );
}

export default Login;
