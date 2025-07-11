import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClientDashboard = () => {
  const [client, setClient] = useState({ name: '', email: '', phone: '' });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('clientToken');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/clients/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setClient(res.data))
    .catch(err => console.error(err));
  }, []);

  const handleChange = e => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/clients/me`, client, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setMessage(res.data.message))
    .catch(err => setMessage('Ошибка при обновлении'));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Личный кабинет клиента</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={client.name} onChange={handleChange} placeholder="Имя" className="w-full p-2 mb-2 border" />
        <input name="email" value={client.email} onChange={handleChange} placeholder="Email" className="w-full p-2 mb-2 border" />
        <input name="phone" value={client.phone} onChange={handleChange} placeholder="Телефон" className="w-full p-2 mb-2 border" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Сохранить</button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default ClientDashboard;
