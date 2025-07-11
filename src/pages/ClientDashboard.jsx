import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClientDashboard = () => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('clientToken');
      try {
        const res = await axios.get('https://travella-production.up.railway.app/api/clients/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClient(res.data);
      } catch (err) {
        console.error('Ошибка при загрузке профиля клиента:', err);
      }
    };

    fetchProfile();
  }, []);

  if (!client) return <div className="text-center mt-10">Загрузка...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Личный кабинет клиента</h2>
      <p><strong>Имя:</strong> {client.name}</p>
      <p><strong>Email:</strong> {client.email}</p>
      <p><strong>Телефон:</strong> {client.phone}</p>
    </div>
  );
};

export default ClientDashboard;
