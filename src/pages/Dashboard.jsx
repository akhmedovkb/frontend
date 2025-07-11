// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://travella-production.up.railway.app/api/providers/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setProvider(data);
        } else {
          setError(data.error || 'Ошибка при получении данных');
        }
      } catch (err) {
        console.error(err);
        setError('Ошибка соединения с сервером');
      }
    };

    fetchProvider();
  }, []);

  if (error) return <div className="text-red-500 mt-10 text-center">{error}</div>;
  if (!provider) return <div className="mt-10 text-center">Загрузка...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold">Личный кабинет</h2>
      <p><strong>Имя:</strong> {provider.first_name} {provider.last_name}</p>
      <p><strong>Email:</strong> {provider.email}</p>
      <p><strong>Телефон:</strong> {provider.phone}</p>
      <p><strong>Город:</strong> {provider.city}</p>
      <p><strong>Языки:</strong> {provider.languages?.join(', ')}</p>
      {provider.images?.length > 0 && (
        <div>
          <strong>Фото:</strong>
          <img src={provider.images[0]} alt="Фото" className="w-full mt-2 rounded shadow" />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
