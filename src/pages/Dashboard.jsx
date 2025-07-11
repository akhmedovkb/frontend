import React from 'react';

function Dashboard() {
  const token = localStorage.getItem('token');

  let user = null;
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      user = JSON.parse(atob(base64));
    } catch (err) {
      console.error('Ошибка при расшифровке токена', err);
    }
  }

  if (!user) {
    return <div>Неверный токен. Пожалуйста, войдите заново.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Добро пожаловать, {user.name || 'Поставщик'}!</h1>
      <p>Email: {user.email}</p>
      <p>Тип: {user.type}</p>
      {/* Добавим позже: редактирование профиля, загрузка услуг и т.д. */}
    </div>
  );
}

export default Dashboard;
