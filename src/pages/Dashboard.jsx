// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    availability: [],
  });
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("https://travella-production.up.railway.app/api/providers/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProvider(data));

    fetch("https://travella-production.up.railway.app/api/providers/services", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, [token]);

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAvailability = () => {
    if (startDate && endDate) {
      const dates = [];
      let curr = new Date(startDate);
      while (curr <= endDate) {
        dates.push(new Date(curr).toISOString().split("T")[0]);
        curr.setDate(curr.getDate() + 1);
      }
      setNewService((prev) => ({
        ...prev,
        availability: [...prev.availability, ...dates],
      }));
      setDateRange([null, null]);
    }
  };

  const handleAddService = async () => {
    const response = await fetch(
      "https://travella-production.up.railway.app/api/providers/services",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newService),
      }
    );
    const result = await response.json();
    alert(result.message);
    setNewService({ title: "", description: "", price: "", category: "", availability: [] });
    setServices([...services, result.service]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto p-6">
      {/* Левая панель профиля */}
      <div className="w-full md:w-1/3 bg-white shadow rounded-xl p-4 space-y-4">
        <button onClick={handleLogout} className="text-red-600 text-sm underline float-right">Выйти</button>
        {provider?.images?.[0] && (
          <img src={provider.images[0]} alt="Фото" className="w-32 h-32 object-cover rounded-full mx-auto" />
        )}
        <div className="text-center font-bold text-xl">{provider?.name}</div>
        <div className="text-center text-sm text-gray-500">{provider?.languages?.join(", ")}</div>

        <div className="text-sm">
          <div><strong>Тип:</strong> {provider?.type}</div>
          <div><strong>Локация:</strong> {provider?.location}</div>
          <div><strong>Email:</strong> {provider?.email}</div>
          <div><strong>Телефон:</strong> {provider?.phone}</div>
          <div><strong>Контактное лицо:</strong> {provider?.contact_name}</div>
          <div><strong>Описание:</strong> {provider?.description}</div>
        </div>
      </div>

      {/* Правая панель услуг */}
      <div className="w-full md:w-2/3">
        <div className="bg-white rounded-xl shadow p-4 mb-10">
          <h2 className="text-lg font-semibold mb-2">Добавить услугу</h2>
          <input name="title" placeholder="Заголовок" value={newService.title} onChange={handleServiceChange} className="w-full mb-2 p-2 border rounded" />
          <input name="description" placeholder="Описание" value={newService.description} onChange={handleServiceChange} className="w-full mb-2 p-2 border rounded" />
          <input name="price" placeholder="Цена" value={newService.price} onChange={handleServiceChange} className="w-full mb-2 p-2 border rounded" />
          <input name="category" placeholder="Категория" value={newService.category} onChange={handleServiceChange} className="w-full mb-2 p-2 border rounded" />

          <div className="mb-2">
            <label className="block font-medium">Доступность:</label>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              isClearable
              inline
            />
            <button onClick={handleAddAvailability} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">
              Добавить даты
            </button>
            <div className="mt-2 text-sm text-gray-600">Выбрано: {newService.availability.join(", ")}</div>
          </div>

          <button onClick={handleAddService} className="bg-primary text-white px-4 py-2 rounded mt-4">
            Сохранить услугу
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Мои услуги</h2>
          {services.map((srv) => (
            <div key={srv.id} className="border p-3 rounded mb-2">
              <div><strong>{srv.title}</strong> — {srv.price} сум</div>
              <div className="text-sm">Категория: {srv.category}</div>
              <div className="text-sm">Доступные даты: {srv.availability?.join(", ")}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
