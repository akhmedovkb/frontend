// pages/ClientDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ClientDashboard() {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    if (!token) return;

    axios.get('https://travella-production.up.railway.app/api/clients/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setClient(res.data))
    .catch(err => console.error('Ошибка при получении данных клиента', err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('clientToken');
    window.location.href = '/client-login';
  };

  if (!client) return <div className="p-6">Загрузка...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Личный кабинет клиента</h1>
      <p><strong>Имя:</strong> {client.name}</p>
      <p><strong>Email:</strong> {client.email}</p>
      <p><strong>Телефон:</strong> {client.phone}</p>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Выйти
      </button>
    </div>
  );
}

export default ClientDashboard;
