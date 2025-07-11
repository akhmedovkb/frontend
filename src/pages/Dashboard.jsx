import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [provider, setProvider] = useState(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://travella-production.up.railway.app/api/providers/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setProvider(data.provider);
        } else {
          console.error("Ошибка загрузки профиля:", data.error);
        }
      } catch (err) {
        console.error("Ошибка при запросе профиля:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!provider) {
    return <div className="text-center mt-10">Загрузка данных...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 mt-10 rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Личный кабинет поставщика</h2>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
        >
          Выйти
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><strong>Тип:</strong> {provider.type}</div>
        <div><strong>Название:</strong> {provider.name}</div>
        <div><strong>Контактное лицо:</strong> {provider.contact_name}</div>
        <div><strong>Email:</strong> {provider.email}</div>
        <div><strong>Телефон:</strong> {provider.phone}</div>
        <div><strong>Локация:</strong> {provider.location}</div>
        <div><strong>Языки:</strong> {provider.languages?.join(", ")}</div>
        <div className="md:col-span-2"><strong>Описание:</strong> {provider.description}</div>

        {provider.images?.length > 0 && (
          <div className="md:col-span-2">
            <strong>Фото:</strong>
            <div className="flex flex-wrap gap-4 mt-2">
              {provider.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Фото ${i + 1}`}
                  className="w-32 h-32 object-cover rounded-xl border"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
