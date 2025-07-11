import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Вы не авторизованы');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          'https://travella-production.up.railway.app/api/providers/profile',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.status === 403) {
          setError('Доступ запрещён. Повторите вход.');
        } else if (!response.ok) {
          setError('Ошибка при загрузке данных профиля');
        } else {
          const data = await response.json();
          setProvider(data);
        }
      } catch (err) {
        setError('Сетевая ошибка. Повторите попытку позже.');
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center mt-10 text-xl">Загрузка...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Личный кабинет поставщика</h2>
      <p><strong>Название:</strong> {provider.name}</p>
      <p><strong>Email:</strong> {provider.email}</p>
      <p><strong>Телефон:</strong> {provider.phone}</p>
      {/* Можно добавить другие поля, если они есть */}
    </div>
  );
};

export default Dashboard;
