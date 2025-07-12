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
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("https://travella-production.up.railway.app/api/providers/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Ошибка при получении профиля");

        const data = await res.json();

        // 🛠️ Ensure languages is always array
        const safeLanguages = Array.isArray(data.languages)
          ? data.languages
          : typeof data.languages === "string"
          ? [data.languages]
          : [];

        setProvider({ ...data, languages: safeLanguages });

        setFormData({
          email: data.email || "",
          password: "",
          images: data.images || [],
        });
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
      }
    };

    fetchProfile();
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
      const res = await fetch("https://travella-production.up.railway.app/api/providers/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      alert(result.message || "Профиль обновлён");
    } catch (err) {
      console.error("Ошибка обновления профиля:", err);
    }
  };

  if (!provider) return <div className="p-6">Загрузка...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Личный кабинет поставщика</h1>
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <p><strong>Название:</strong> {provider.name}</p>
        <p><strong>Тип услуги:</strong> {provider.type}</p>
        <p><strong>Контактное лицо:</strong> {provider.contact_name}</p>

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

        <p><strong>Телефон:</strong> {provider.phone}</p>

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

        <p><strong>Локация:</strong> {provider.location}</p>
        <p><strong>Описание:</strong> {provider.description}</p>
        <p><strong>Языки:</strong> {provider.languages.join(", ")}</p>

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
    </div>
  );
};

export default Dashboard;
