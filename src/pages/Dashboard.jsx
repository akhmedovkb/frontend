
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

  useEffect(() => {
    if (!token) return navigate("/login");

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
        const dateStr = new Date(curr).toISOString().split("T")[0];
        if (!newService.availability.includes(dateStr)) {
          dates.push(dateStr);
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

  const handleEditService = (service) => {
    setEditingServiceId(service.id);
    setNewService(service);
  };

  const handleUpdateService = async () => {
    const response = await fetch(
      \`https://travella-production.up.railway.app/api/providers/services/\${editingServiceId}\`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: \`Bearer \${token}\`,
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
      setNewService({
        title: "",
        description: "",
        price: "",
        category: "",
        availability: [],
      });
      setEditingServiceId(null);
    }
  };

  const handleDeleteService = async (id) => {
    await fetch(\`https://travella-production.up.railway.app/api/providers/services/\${id}\`, {
      method: "DELETE",
      headers: { Authorization: \`Bearer \${token}\` },
    });
    setServices(services.filter((s) => s.id !== id));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={handleLogout} className="mb-4 text-red-500 underline">Выйти</button>
      <h2 className="text-xl font-bold">{editingServiceId ? "Редактировать услугу" : "Добавить услугу"}</h2>
      <input name="title" placeholder="Заголовок" value={newService.title} onChange={handleServiceChange} className="w-full border p-2 my-2" />
      <input name="description" placeholder="Описание" value={newService.description} onChange={handleServiceChange} className="w-full border p-2 my-2" />
      <input name="price" placeholder="Цена" value={newService.price} onChange={handleServiceChange} className="w-full border p-2 my-2" />
      <input name="category" placeholder="Категория" value={newService.category} onChange={handleServiceChange} className="w-full border p-2 my-2" />
      <DatePicker selectsRange startDate={startDate} endDate={endDate} onChange={(update) => setDateRange(update)} inline />
      <button onClick={handleAddAvailability} className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">Добавить даты</button>
      <div className="text-sm mt-2 text-gray-600">Выбрано: {newService.availability.join(", ")}</div>
      <button onClick={editingServiceId ? handleUpdateService : null} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
        {editingServiceId ? "Сохранить изменения" : "Добавить"}
      </button>

      <h3 className="mt-8 text-lg font-semibold">Мои услуги</h3>
      {services.map((s) => (
        <div key={s.id} className="border rounded p-4 mt-2">
          <div><strong>{s.title}</strong> — {s.price} сум</div>
          <div className="text-sm text-gray-500">Категория: {s.category}</div>
          <div className="text-sm text-gray-500">Даты: {s.availability?.join(", ")}</div>
          <button onClick={() => handleEditService(s)} className="text-blue-500 mr-4">✏️ Редактировать</button>
          <button onClick={() => handleDeleteService(s.id)} className="text-red-500">🗑 Удалить</button>
        </div>
      ))}
    </div>
  );
};
export default Dashboard;
