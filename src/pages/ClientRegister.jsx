import React, { useState } from 'react';

function ClientRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('https://travella-production.up.railway.app/api/clients/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ошибка при регистрации');
      } else {
        setMessage('Регистрация успешна!');
        setFormData({ name: '', email: '', phone: '', password: '' });
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl mb-4 text-center font-bold">Регистрация клиента</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          name="name"
          placeholder="Имя"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="text"
          name="phone"
          placeholder="Телефон"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Зарегистрироваться
        </button>
      </form>
      {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
    </div>
  );
}

export default ClientRegister;
import React, { useState } from 'react';

function ClientRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('https://travella-production.up.railway.app/api/clients/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Регистрация прошла успешно. Теперь вы можете войти.');
        setFormData({ name: '', email: '', phone: '', password: '' });
      } else {
        setError(data.error || 'Ошибка регистрации');
      }
    } catch (err) {
      console.error(err);
      setError('Ошибка соединения с сервером');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold">Регистрация клиента</h2>

      <input
        type="text"
        name="name"
        placeholder="Имя"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Телефон"
        value={formData.phone}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Пароль"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Зарегистрироваться
      </button>
    </form>
  );
}

export default ClientRegister;
