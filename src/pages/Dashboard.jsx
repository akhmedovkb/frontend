// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "", images: [] });
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ title: "", description: "", price: "", category: "", image: "" });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editServiceData, setEditServiceData] = useState({ title: "", description: "", price: "", category: "", image: "" });

  const token = localStorage.getItem("providerToken");

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchData = async () => {
      try {
        const profileRes = await fetch("https://travella-production.up.railway.app/api/providers/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();
        setProvider(profileData);
        setFormData({ email: profileData.email || "", password: "", images: profileData.images || [] });

        const servicesRes = await fetch("https://travella-production.up.railway.app/api/providers/services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const servicesData = await servicesRes.json();
        setServices(servicesData);
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
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
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch("https://travella-production.up.railway.app/api/providers/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      alert(result.message || "Профиль обновлён");
      setProvider((prev) => ({ ...prev, ...formData }));
    } catch (err) {
      console.error("Ошибка обновления профиля:", err);
    }
  };

  const handleServiceInput = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setNewService((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const addService = async () => {
    try {
      const res = await fetch("https://travella-production.up.railway.app/api/providers/services", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newService),
      });
      const data = await res.json();
      setServices((prev) => [...prev, data]);
      setNewService({ title: "", description: "", price: "", category: "", image: "" });
    } catch (err) {
      console.error("Ошибка добавления услуги:", err);
    }
  };

  const deleteService = async (id) => {
    try {
      await fetch(`https://travella-production.up.railway.app/api/providers/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Ошибка удаления услуги:", err);
    }
  };

  const startEditService = (service) => {
    setEditingServiceId(service.id);
    setEditServiceData(service);
  };

  const saveEditService = async () => {
    try {
      const res = await fetch(`https://travella-production.up.railway.app/api/providers/services/${editingServiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editServiceData),
      });
      const updated = await res.json();
      setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setEditingServiceId(null);
      setEditServiceData({ title: "", description: "", price: "", category: "", image: "" });
    } catch (err) {
      console.error("Ошибка обновления услуги:", err);
    }
  };

  if (!provider) return <div className="p-6">Загрузка...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Личный кабинет поставщика</h1>

      {/* Профиль */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div><strong>Название:</strong> {provider.name}</div>
        <div><strong>Тип:</strong> {provider.type}</div>
        <div><strong>Email:</strong>
          <input name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div><strong>Пароль:</strong>
          <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div><strong>Фото:</strong>
          {provider.images?.[0] && <img src={provider.images[0]} alt="img" className="w-20 h-20 object-cover rounded" />}
          <input type="file" onChange={handleChange} className="mt-2" />
        </div>
        <button onClick={handleUpdate} className="bg-primary text-white px-4 py-2 rounded">Сохранить профиль</button>
      </div>

      <div className="mt-6">
        <button onClick={handleLogout} className="text-red-600 text-sm underline">Выйти</button>
      </div>

      {/* Услуги */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Мои услуги</h2>

        {services.map((s) => (
          <div key={s.id} className="border p-4 rounded mb-4">
            {editingServiceId === s.id ? (
              <div className="space-y-2">
                <input name="title" value={editServiceData.title} onChange={(e) => setEditServiceData({ ...editServiceData, title: e.target.value })} className="w-full border p-2 rounded" />
                <textarea name="description" value={editServiceData.description} onChange={(e) => setEditServiceData({ ...editServiceData, description: e.target.value })} className="w-full border p-2 rounded" />
                <input name="price" value={editServiceData.price} onChange={(e) => setEditServiceData({ ...editServiceData, price: e.target.value })} className="w-full border p-2 rounded" />
                <input name="category" value={editServiceData.category} onChange={(e) => setEditServiceData({ ...editServiceData, category: e.target.value })} className="w-full border p-2 rounded" />
                <button onClick={saveEditService} className="bg-blue-500 text-white px-3 py-1 rounded">Сохранить</button>
              </div>
            ) : (
              <>
                <div><strong>{s.title}</strong> — {s.category} — ${s.price}</div>
                <p>{s.description}</p>
                {s.image && <img src={s.image} alt="" className="w-24 h-24 object-cover mt-2 rounded" />}
                <div className="mt-2 space-x-2">
                  <button onClick={() => startEditService(s)} className="text-sm text-blue-600 underline">Редактировать</button>
                  <button onClick={() => deleteService(s.id)} className="text-sm text-red-600 underline">Удалить</button>
                </div>
              </>
            )}
          </div>
        ))}

        <h3 className="font-semibold mt-6">Добавить услугу:</h3>
        <input name="title" value={newService.title} onChange={handleServiceInput} placeholder="Название" className="w-full border p-2 rounded mt-2" />
        <textarea name="description" value={newService.description} onChange={handleServiceInput} placeholder="Описание" className="w-full border p-2 rounded mt-2" />
        <input name="price" value={newService.price} onChange={handleServiceInput} placeholder="Цена" className="w-full border p-2 rounded mt-2" />
        <input name="category" value={newService.category} onChange={handleServiceInput} placeholder="Категория" className="w-full border p-2 rounded mt-2" />
        <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-2" />
        <button onClick={addService} className="bg-green-600 text-white px-4 py-2 rounded mt-3">Добавить</button>
      </div>
    </div>
  );
};

export default Dashboard;
