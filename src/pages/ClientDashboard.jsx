import React, { useEffect, useState } from 'react';

function ClientDashboard() {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      const token = localStorage.getItem('clientToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setClient(data);
    };
    fetchClient();
  }, []);

  if (!client) return <p className="text-center mt-10">Загрузка...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl mb-4">Личный кабинет клиента</h2>
      <p><strong>Имя:</strong> {client.name}</p>
      <p><strong>Email:</strong> {client.email}</p>
      <p><strong>Телефон:</strong> {client.phone}</p>
    </div>
  );
}

export default ClientDashboard;
