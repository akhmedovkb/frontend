
// src/pages/Dashboard.jsx

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
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editingProviderField, setEditingProviderField] = useState("");
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
        const iso = new Date(curr).toISOString().split("T")[0];
        if (!newService.availability.includes(iso)) dates.push(iso);
        curr.setDate(curr.getDate() + 1);
      }
      setNewService((prev) => ({
        ...prev,
        availability: [...prev.availability, ...dates],
      }));
      setDateRange([null, null]);
    }
  };

  const handleUpdateProfile = async () => {
    const res = await fetch("https://travella-production.up.railway.app/api/providers/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedProvider),
    });
    const data = await res.json();
    if (res.ok) {
      setProvider(data);
      setEditingProviderField("");
      alert("Профиль обновлён");
    }
  };

  const toggleDate = (date) => {
    const iso = new Date(date).toISOString().split("T")[0];
    setNewService((prev) => ({
      ...prev,
      availability: prev.availability.includes(iso)
        ? prev.availability.filter((d) => d !== iso)
        : [...prev.availability, iso],
    }));
  };

  const isDateSelected = (date) => {
    const iso = new Date(date).toISOString().split("T")[0];
    return newService.availability.includes(iso);
  };

  if (!provider) return <div>Загрузка...</div>;

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-6 gap-6">
      <div className="w-full md:w-1/3 bg-white p-6 rounded-xl shadow space-y-4">
        <button onClick={handleLogout} className="text-sm text-red-600 underline">Выйти</button>
        {provider.images?.[0] && (
          <img src={provider.images[0]} alt="Фото" className="w-32 h-32 rounded-full object-cover mx-auto" />
        )}
        {["name", "languages", "location", "password"].map((field) => (
          <div key={field}>
            <label className="block font-medium capitalize">{field}:</label>
            {editingProviderField === field ? (
              <input
                name={field}
                value={updatedProvider[field] || ""}
                onChange={(e) => setUpdatedProvider((p) => ({ ...p, [field]: e.target.value }))}
                onBlur={handleUpdateProfile}
                className="w-full p-2 border rounded"
              />
            ) : (
              <div>
                <span>{provider[field]}</span>
                <button onClick={() => setEditingProviderField(field)} className="ml-2 text-blue-600 text-sm">✏️</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="w-full md:w-2/3 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Добавить услугу</h2>
        {["title", "description", "price", "category"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field}
            value={newService[field]}
            onChange={handleServiceChange}
            className="w-full mb-2 p-2 border rounded"
          />
        ))}

        <label className="block font-medium mb-1">Доступные даты:</label>
        <DatePicker
          inline
          highlightDates={newService.availability.map((d) => new Date(d))}
          dayClassName={(d) => isDateSelected(d) ? "bg-blue-200 rounded-full" : undefined}
          onDayClick={toggleDate}
        />

        <div className="text-sm text-gray-600 mt-2">
          Выбрано: {newService.availability.join(", ")}
        </div>
        <button onClick={() => alert("Реализация сохранения")} className="mt-4 bg-primary text-white px-4 py-2 rounded">Сохранить</button>
      </div>
    </div>
  );
};

export default Dashboard;
