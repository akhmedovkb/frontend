import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [formData, setFormData] = useState({
    company_type: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    languages: '',
  });
  const [message, setMessage] = useState('');

  // Получаем профиль при загрузке компонента
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('https://travella-production.up.railway.app/api/providers/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setFormData({
            company_type: data.company_type || '',
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            phone: data.phone || '',
            languages: (data.languages || []).join(', '),
          });
        } else {
          setMessage(data.error || 'Ошибка загрузки профиля');
        }
      } catch (err) {
        setMessage('Ошибка сервера');
      }
    };

    fetchProfile();
  }, []);

  // Обработка изменений формы
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Отправка обновлённого профиля
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('https://travella-production.up.railway.app/api/providers/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          languages: formData.languages.split(',').map((lang) => lang.trim()),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Профиль успешно обновлён');
      } else {
        setMessage(data.error || 'Ошибка при обновлении');
      }
    } catch (err) {
      setMessage('Ошибка сервера');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Личный кабинет поставщика</h2>

      {message && <div className="mb-4 text-blue-600">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="company_type"
          placeholder="Тип компании"
          value={formData.company_type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="first_name"
          placeholder="Имя"
          value={formData.first_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Фамилия"
          value={formData.last_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Телефон"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="languages"
          placeholder="Языки (через запятую)"
          value={formData.languages}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Сохранить изменения
        </button>
      </form>
    </div>
  );
}

export default Dashboard;
