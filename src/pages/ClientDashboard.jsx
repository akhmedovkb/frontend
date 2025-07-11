import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ClientDashboard() {
  const [client, setClient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClient = async () => {
      const token = localStorage.getItem('clientToken');
      if (!token) return navigate('/client-login');

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Ошибка при получении данных');
        const data = await response.json();
        setClient(data);
      } catch (error) {
        console.error(error);
        localStorage.removeItem('clientToken');
        navigate('/client-login');
      }
    };

    fetchClient();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('clientToken');
    navigate('/client-login');
  };

  if (!client) return <div>Загрузка...</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Личный кабинет клиента</h1>
      <p><strong>Имя:</strong> {client.name}</p>
      <p><strong>Email:</strong> {client.email}</p>
      <p><strong>Телефон:</strong> {client.phone}</p>
      <button onClick={handleLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
        Выйти
      </button>
    </div>
  );
}

export default ClientDashboard;
