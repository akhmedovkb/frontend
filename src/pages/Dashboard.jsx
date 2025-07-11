// /src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [provider, setProvider] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('https://travella-production.up.railway.app/api/providers/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setProvider(data);
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!provider) return <p className="text-center mt-10">Загрузка...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Личный кабинет</h2>
      <p><strong>Имя:</strong> {provider.first_name}</p>
      <p><strong>Email:</strong> {provider.email}</p>
      <p><strong>Телефон:</strong> {provider.phone}</p>
      <p><strong>Город:</strong> {provider.city}</p>
      <p><strong>Роль:</strong> {provider.type}</p>
      <p><strong>Языки:</strong> {provider.languages?.join(', ')}</p>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
      >
        Выйти
      </button>
    </div>
  );
}

export default Dashboard;
