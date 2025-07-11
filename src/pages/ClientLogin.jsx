import React, { useState } from 'react';

const ClientLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [client, setClient] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ошибка входа');
      } else {
        localStorage.setItem('clientToken', data.token);
        setClient(data.client);
      }
    } catch (err) {
      setError('Ошибка сети');
    }
  };

  if (client) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center">
        <h2 className="text-2xl font-bold">Добро пожаловать, {client.name}!</h2>
        <p className="mt-2">Email: {client.email}</p>
        <p>Телефон: {client.phone}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Вход клиента</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Войти
        </button>
      </form>
    </div>
  );
};

export default ClientLogin;
