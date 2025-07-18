
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("providerToken");
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    availability: [],
  });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [editingProvider, setEditingProvider] = useState(false);
  const [updatedProvider, setUpdatedProvider] = useState({});

  useEffect(() => {
    if (!token) return navigate("/login");

    fetch("https://travella-production.up.railway.app/api/providers/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProvider(data);
        setUpdatedProvider(data);
      });

    fetch("https://travella-production.up.railway.app/api/providers/services", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("providerToken");
    navigate("/login");
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAvailability = () => {
    if (startDate && endDate) {
      const dates = [];
      let curr = new Date(startDate);
      while (curr <= endDate) {
        const formatted = new Date(curr).toISOString().split("T")[0];
        if (!newService.availability.includes(formatted)) {
          dates.push(formatted);
        }
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
    if (response.ok) {
      alert("Услуга добавлена");
      setServices([...services, result.service]);
      setNewService({ title: "", description: "", price: "", category: "", availability: [] });
    }
  };

  const handleDeleteService = async (id) => {
    await fetch(`https://travella-production.up.railway.app/api/providers/services/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setServices(services.filter((s) => s.id !== id));
  };

  const handleEditService = (service) => {
    setEditingServiceId(service.id);
    setNewService(service);
  };

  const handleUpdateService = async () => {
    const response = await fetch(
      `https://travella-production.up.railway.app/api/providers/services/${editingServiceId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newService),
      }
    );
    const result = await response.json();
    if (response.ok) {
      alert("Услуга обновлена");
      setServices(
        services.map((s) => (s.id === editingServiceId ? result.service : s))
      );
      setNewService({ title: "", description: "", price: "", category: "", availability: [] });
      setEditingServiceId(null);
    }
  };

  const handleProviderChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProvider((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    const response = await fetch("https://travella-production.up.railway.app/api/providers/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedProvider),
    });
    const data = await response.json();
    if (response.ok) {
      alert("Профиль обновлён");
      setProvider(data);
      setEditingProvider(false);
    }
  };

  if (!provider) return <div>Загрузка...</div>;

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-6 gap-6">
      <div className="w-full md:w-1/3 bg-white p-6 rounded-xl shadow space-y-4">
        <button onClick={handleLogout} className="text-sm text-red-600 underline">Выйти</button>
        {provider.images?.[0] && (
          <img src={provider.images[0]} alt="Фото" className="w-32 h-32 rounded-full object-cover mx-auto" />
        )}
        {editingProvider ? (
          <div className="space-y-2">
            <input name="name" value={updatedProvider.name || ""} onChange={handleProviderChange} className="w-full border p-2 rounded" />
            <input name="languages" value={updatedProvider.languages || ""} onChange={handleProviderChange} className="w-full border p-2 rounded" />
            <input name="type" value={updatedProvider.type || ""} onChange={handleProviderChange} className="w-full border p-2 rounded" />
            <input name="location" value={updatedProvider.location || ""} onChange={handleProviderChange} className="w-full border p-2 rounded" />
            <button onClick={handleUpdateProfile} className="bg-blue-500 text-white px-4 py-2 rounded">Сохранить</button>
          </div>
        ) : (
          <>
            <div className="text-center text-xl font-bold">{provider.name}</div>
            <div className="text-center text-gray-600">{provider.languages?.join(", ")}</div>
            <div>Тип: {provider.type}</div>
            <div>Локация: {provider.location}</div>
            <div>Email: {provider.email}</div>
            <button onClick={() => setEditingProvider(true)} className="mt-2 text-blue-500 underline">Редактировать</button>
          </>
        )}
      </div>

      <div className="w-full md:w-2/3 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">
          {editingServiceId ? "Редактировать услугу" : "Добавить услугу"}
        </h2>
        <input name="title" placeholder="Заголовок" value={newService.title} onChange={handleServiceChange} className="w-full mb-2 p-2 border rounded" />
        <input name="description" placeholder="Описание" value={newService.description} onChange={handleServiceChange} className="w-full mb-2 p-2 border rounded" />
        <input name="price" placeholder="Цена" value={newService.price} onChange={handleServiceChange} className="w-full mb-2 p-2 border rounded" />
        <input name="category" placeholder="Категория" value={newService.category} onChange={handleServiceChange} className="w-full mb-2 p-2 border rounded" />
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => setDateRange(update)}
          isClearable
          inline
        />
        <button onClick={handleAddAvailability} className="mt-2 bg-gray-600 text-white px-3 py-1 rounded">
          Добавить даты
        </button>
        <div className="text-sm text-gray-600 mt-2">
          Выбрано: {newService.availability.join(", ")}
        </div>
        <button
          onClick={editingServiceId ? handleUpdateService : handleAddService}
          className="bg-primary text-white px-4 py-2 rounded mt-4"
        >
          {editingServiceId ? "Сохранить изменения" : "Сохранить услугу"}
        </button>

        <hr className="my-6" />
        <h2 className="text-xl font-bold mb-2">Мои услуги</h2>
        {services.map((srv) => (
          <div key={srv.id} className="border p-3 rounded mb-2">
            <div><strong>{srv.title}</strong> — {srv.price} сум</div>
            <div className="text-sm text-gray-500">Категория: {srv.category}</div>
            <div className="text-sm text-gray-500">Даты: {srv.availability?.join(", ")}</div>
            <button onClick={() => handleEditService(srv)} className="text-blue-500 text-sm mr-3">✏️ Редактировать</button>
            <button onClick={() => handleDeleteService(srv.id)} className="text-red-500 text-sm">🗑 Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
