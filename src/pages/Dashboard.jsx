// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    images: [],
  });

  const token = localStorage.getItem("providerToken");

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://travella-production.up.railway.app/api/providers/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setProvider(data);
        setFormData({
          email: data.email || "",
          password: "",
          images: data.images || [],
        });
      } catch (err) {
        console.error("Ошибка загрузки профиля:", err);
      }
    };

    fetchData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("providerToken");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, images: [reader.result] }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        "https://travella-production.up.railway.app/api/providers/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      alert(result.message || "Профиль обновлён");
      setProvider((prev) => ({ ...prev, ...formData }));
    } catch (err) {
      console.error("Ошибка обновления профиля:", err);
    }
  };

  if (!provider) return <div className="p-6">Загрузка...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Личный кабинет поставщика</h1>
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="block font-medium">Название:</label>
          <div className="text-lg">{provider.name}</div>
        </div>
        <div>
          <label className="block font-medium">Тип услуги:</label>
          <div>{provider.type}</div>
        </div>
        <div>
          <label className="block font-medium">Контактное лицо:</label>
          <div>{provider.contact_name}</div>
        </div>
        <div>
          <label className="block font-medium">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Телефон:</label>
          <div>{provider.phone}</div>
        </div>
        <div>
          <label className="block font-medium">Пароль (новый):</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Локация:</label>
          <div>{provider.location}</div>
        </div>
        <div>
          <label className="block font-medium">Описание:</label>
          <div>{provider.description}</div>
        </div>
        <div>
          <label className="block font-medium">Языки:</label>
          <div>
            {Array.isArray(provider.languages)
              ? provider.languages.join(", ")
              : provider.languages}
          </div>
        </div>
        <div>
          <label className="block font-medium">Фото:</label>
          {provider.images?.length > 0 && (
            <img
              src={provider.images[0]}
              alt="Фото"
              className="w-32 h-32 object-cover rounded"
            />
          )}
          <input type="file" accept="image/*" onChange={handleChange} className="mt-2" />
        </div>
        <button
          onClick={handleUpdate}
          className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-secondary"
        >
          Сохранить изменения
        </button>
      </div>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 underline"
        >
          Выйти из аккаунта
        </button>
      </div>

      {/* Блок управления услугами (пока placeholder) */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Мои услуги</h2>
        <p>Управление услугами появится здесь...</p>
      </div>
    </div>
  );
};

export default Dashboard;
