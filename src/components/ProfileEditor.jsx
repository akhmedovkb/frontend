// ✅ src/components/ProfileEditor.jsx
import React, { useEffect, useState } from 'react';

function ProfileEditor() {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('https://travella-production.up.railway.app/api/providers/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setProvider(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setMsg('Ошибка загрузки профиля');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (!provider) return <p>{msg || 'Ошибка'}</p>;

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Ваш профиль</h2>
      <p><strong>Имя:</strong> {provider.firstname}</p>
      <p><strong>Фамилия:</strong> {provider.lastname}</p>
      <p><strong>Email:</strong> {provider.email}</p>
      <p><strong>Телефон:</strong> {provider.phone}</p>
      <p><strong>Город:</strong> {provider.city}</p>
      <p><strong>Языки:</strong> {provider.languages?.join(', ')}</p>
    </div>
  );
}

export default ProfileEditor;
