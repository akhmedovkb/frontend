import React, { useEffect, useState } from 'react';

function ClientDashboard() {
  const [client, setClient] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch('https://travella-production.up.railway.app/api/clients/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('clientToken')}`
          }
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Ошибка получения данных');
        } else {
          setClient(data);
        }
      } catch (err) {
        setError('Ошибка подключения');
      }
    };

    fetchClient();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('clientToken');
    window.location.href = '/client/login';
  };

  if (error) {
    return <p className="text-center text-red-600 mt-10">{error}</p>;
  }

  if (!client) {
    return <p className="text-center mt-10">Загрузка...</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl mb-4 font-bold text-center">Личный кабинет клиента</h2>
      <p><strong>Имя:</strong> {client.name}</p>
      <p><strong>Email:</strong> {client.email}</p>
      <p><strong>Телефон:</strong> {client.phone}</p>
      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        Выйти
      </button>
    </div>
  );
}

export default ClientDashboard;
