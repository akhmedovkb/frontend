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
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    images: [],
  });

  const token = localStorage.getItem("providerToken");

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchData = async () => {
      try {
        const response = await fetch("https://travella-production.up.railway.app/api/providers/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setProvider(data);
        setFormData({
          email: data.email || "",
          password: "",
          images: data.images || [],
        });

        // Получение услуг
        const resServices = await fetch("https://travella-production.up.railway.app/api/providers/services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const serviceData = await resServices.json();
        setServices(serviceData);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
      }
    };

    fetchData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("providerToken");
    navigate("/login");
  };

  const handleProfileChange = (e) => {
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

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch("https://travella-production.up.railway.app/api/providers/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      alert(result.message || "Профиль обновлён");
    } catch (err) {
      console.error("Ошибка обновления профиля:", err);
    }
  };

  const handleServiceChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const handleServiceImageChange = (e, index) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...services];
      updated[index].images = [reader.result];
      setServices(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateService = async (service) => {
    try {
      await fetch(`https://travella-production.up.railway.app/api/providers/services/${service.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(service),
      });
      alert("Услуга обновлена");
    } catch (err) {
      console.error("Ошибка обновления услуги:", err);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Удалить услугу?")) return;
    try {
      await fetch(`https://travella-production.up.railway.app/api/providers/services/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServices(services.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Ошибка удаления:", err);
    }
  };

  const handleNewServiceChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewService((prev) => ({ ...prev, images: [reader.result] }));
      };
      reader.readAsDataURL(file);
    } else {
      setNewService({ ...newService, [name]: value });
    }
  };

  const handleAddService = async () => {
    try {
      const response = await fetch("https://travella-production.up.railway.app/api/providers/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newService),
      });
      const result = await response.json();
      setServices([...services, result]);
      setNewService({ title: "", description: "", price: "", category: "", images: [] });
    } catch (err) {
      console.error("Ошибка добавления услуги:", err);
    }
  };

  if (!provider) return <div className="p-6">Загрузка...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold">Личный кабинет поставщика</h1>

      {/* Профиль */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Профиль</h2>
          <button onClick={handleLogout} className="text-sm text-red-600 underline">Выйти</button>
        </div>
        <input name="email" value={formData.email} onChange={handleProfileChange} placeholder="Email" className="w-full border p-2 rounded" />
        <input name="password" type="password" value={formData.password} onChange={handleProfileChange} placeholder="Новый пароль" className="w-full border p-2 rounded" />
        <input type="file" onChange={handleProfileChange} className="w-full border p-2 rounded" />
        <button onClick={handleUpdateProfile} className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary">Сохранить</button>
      </div>

      {/* Услуги */}
      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        <h2 className="text-xl font-semibold">Мои услуги</h2>

        {services.map((service, index) => (
          <div key={service.id} className="border p-4 rounded-xl space-y-2">
            <input
              value={service.title}
              onChange={(e) => handleServiceChange(index, "title", e.target.value)}
              className="w-full border p-2 rounded"
            />
            <textarea
              value={service.description}
              onChange={(e) => handleServiceChange(index, "description", e.target.value)}
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              value={service.price}
              onChange={(e) => handleServiceChange(index, "price", e.target.value)}
              className="w-full border p-2 rounded"
            />
            <input
              value={service.category}
              onChange={(e) => handleServiceChange(index, "category", e.target.value)}
              className="w-full border p-2 rounded"
            />
            {service.images?.[0] && <img src={service.images[0]} className="w-24 h-24 object-cover rounded" />}
            <input type="file" onChange={(e) => handleServiceImageChange(e, index)} />
            <div className="flex gap-4">
              <button onClick={() => handleUpdateService(service)} className="bg-blue-500 text-white px-3 py-1 rounded">Сохранить</button>
              <button onClick={() => handleDeleteService(service.id)} className="bg-red-500 text-white px-3 py-1 rounded">Удалить</button>
            </div>
          </div>
        ))}

        {/* Добавить новую услугу */}
        <div className="border p-4 rounded-xl space-y-2 bg-gray-50">
          <h3 className="font-semibold">Новая услуга</h3>
          <input name="title" value={newService.title} onChange={handleNewServiceChange} placeholder="Название" className="w-full border p-2 rounded" />
          <textarea name="description" value={newService.description} onChange={handleNewServiceChange} placeholder="Описание" className="w-full border p-2 rounded" />
          <input name="price" value={newService.price} onChange={handleNewServiceChange} placeholder="Цена" className="w-full border p-2 rounded" />
          <input name="category" value={newService.category} onChange={handleNewServiceChange} placeholder="Категория" className="w-full border p-2 rounded" />
          <input type="file" onChange={handleNewServiceChange} />
          <button onClick={handleAddService} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Добавить</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
