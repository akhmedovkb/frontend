// Дополнение в файл: src/pages/Dashboard.jsx
// ВНИМАНИЕ: Это продолжение текущего Dashboard.jsx
// CRUD блок "Мои услуги"

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  // ... (существующий код остаётся)
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    images: [],
  });

  const fetchServices = async () => {
    try {
      const res = await fetch("https://travella-production.up.railway.app/api/providers/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Ошибка при загрузке услуг:", err);
    }
  };

  const handleServiceChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
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
      const res = await fetch("https://travella-production.up.railway.app/api/providers/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newService),
      });
      const result = await res.json();
      alert("Услуга добавлена");
      fetchServices();
      setNewService({ title: "", description: "", price: "", category: "", images: [] });
    } catch (err) {
      console.error("Ошибка добавления услуги:", err);
    }
  };

  const handleDeleteService = async (id) => {
    if (!confirm("Удалить услугу?")) return;
    try {
      await fetch(`https://travella-production.up.railway.app/api/providers/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchServices();
    } catch (err) {
      console.error("Ошибка удаления услуги:", err);
    }
  };

  useEffect(() => {
    if (token) fetchServices();
  }, [token]);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Мои услуги</h2>

      <div className="space-y-3 mb-6">
        <input
          type="text"
          name="title"
          placeholder="Название"
          value={newService.title}
          onChange={handleServiceChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Описание"
          value={newService.description}
          onChange={handleServiceChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Цена"
          value={newService.price}
          onChange={handleServiceChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Категория"
          value={newService.category}
          onChange={handleServiceChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          onChange={handleServiceChange}
          className="w-full"
        />
        <button
          onClick={handleAddService}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary"
        >Добавить услугу</button>
      </div>

      {services.map((srv) => (
        <div
          key={srv.id}
          className="border rounded p-4 mb-4 bg-white shadow"
        >
          <div className="font-bold">{srv.title}</div>
          <div>{srv.description}</div>
          <div>Цена: {srv.price}</div>
          <div>Категория: {srv.category}</div>
          {srv.images?.length > 0 && (
            <img
              src={srv.images[0]}
              alt="Услуга"
              className="w-24 h-24 object-cover mt-2"
            />
          )}
          <button
            onClick={() => handleDeleteService(srv.id)}
            className="mt-2 text-red-600 underline"
          >Удалить</button>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
