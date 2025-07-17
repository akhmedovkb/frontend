// ✅ Dashboard.jsx — редактирование профиля и услуг
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("providerToken");
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [newService, setNewService] = useState({
    title: "", description: "", price: "", category: "", availability: [],
  });
  const [editProfile, setEditProfile] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    if (!token) return navigate("/login");

    fetch("https://travella-production.up.railway.app/api/providers/profile", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.json()).then(data => {
      setProvider(data);
      setUpdatedProfile(data);
    });

    fetch("https://travella-production.up.railway.app/api/providers/services", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.json()).then(setServices);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("providerToken");
    navigate("/login");
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAvailability = () => {
    if (startDate && endDate) {
      const dates = [];
      let curr = new Date(startDate);
      while (curr <= endDate) {
        dates.push(new Date(curr).toISOString().split("T")[0]);
        curr.setDate(curr.getDate() + 1);
      }
      setNewService(prev => ({ ...prev, availability: [...prev.availability, ...dates] }));
      setDateRange([null, null]);
    }
  };

  const handleAddService = async () => {
    const response = await fetch("https://travella-production.up.railway.app/api/providers/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newService),
    });
    const result = await response.json();
    if (response.ok) {
      setNewService({ title: "", description: "", price: "", category: "", availability: [] });
      setServices([...services, result.service]);
    } else {
      alert("Ошибка при добавлении");
    }
  };

  const handleEditService = (service) => {
    setEditingServiceId(service.id);
    setNewService(service);
  };

  const handleSaveEditedService = async () => {
    const response = await fetch(`https://travella-production.up.railway.app/api/providers/services/${editingServiceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newService),
    });
    const result = await response.json();
    if (response.ok) {
      setServices(services.map(s => s.id === editingServiceId ? result.service : s));
      setNewService({ title: "", description: "", price: "", category: "", availability: [] });
      setEditingServiceId(null);
    }
  };

  const handleDeleteService = async (id) => {
    await fetch(`https://travella-production.up.railway.app/api/providers/services/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setServices(services.filter(s => s.id !== id));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    const res = await fetch("https://travella-production.up.railway.app/api/providers/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedProfile),
    });
    if (res.ok) {
      setProvider(updatedProfile);
      setEditProfile(false);
    }
  };

  if (!provider) return <div className="p-6">Загрузка...</div>;

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-6 gap-6">
      <div className="w-full md:w-1/3 bg-white rounded-xl shadow p-6 space-y-4">
        <button onClick={handleLogout} className="text-sm text-red-600 underline mb-4">Выйти</button>
        {provider.images?.[0] && (
          <img src={provider.images[0]} alt="Фото" className="w-32 h-32 rounded-full object-cover mx-auto" />
        )}
        {editProfile ? (
          <div>
            <input name="name" value={updatedProfile.name || ""} onChange={handleProfileChange} className="w-full mb-2 border p-2" />
            <input name="email" value={updatedProfile.email || ""} onChange={handleProfileChange} className="w-full mb-2 border p-2" />
            <input name="phone" value={updatedProfile.phone || ""} onChange={handleProfileChange} className="w-full mb-2 border p-2" />
            <button onClick={handleSaveProfile} className="bg-blue-500 text-white px-4 py-1 rounded">Сохранить</button>
          </div>
        ) : (
          <div>
            <div className="text-center font-bold text-xl">{provider.name}</div>
            <div>{provider.email}</div>
            <div>{provider.phone}</div>
            <button onClick={() => setEditProfile(true)} className="mt-2 underline text-blue-600">Редактировать</button>
          </div>
        )}
      </div>

      <div className="w-full md:w-2/3 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">{editingServiceId ? "Редактировать услугу" : "Добавить услугу"}</h2>
        <input name="title" placeholder="Заголовок" value={newService.title} onChange={handleServiceChange} className="w-full mb-2 p-2 border rounded" />
        <input name="description" placeholder="Описание" value={newService.description} onChange={handleServiceChange} className="w-full mb-2 p-2 border rounded" />
        <input name="price" placeholder="Цена" value={newService.price} onChange={handleServiceChange} className="w-full mb-2 p-2 border rounded" />
        <input name="category" placeholder="Категория" value={newService.category} onChange={handleServiceChange} className="w-full mb-2 p-2 border rounded" />
        <DatePicker selectsRange startDate={startDate} endDate={endDate} onChange={(update) => setDateRange(update)} isClearable inline />
        <button onClick={handleAddAvailability} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">Добавить даты</button>
        <div className="text-sm text-gray-600 mt-2">Выбрано: {newService.availability.join(", ")}</div>
        <button onClick={editingServiceId ? handleSaveEditedService : handleAddService} className="bg-primary text-white px-4 py-2 rounded mt-4">
          {editingServiceId ? "Сохранить изменения" : "Сохранить услугу"}
        </button>

        <h2 className="text-xl font-bold mt-6 mb-2">Мои услуги</h2>
        {services.map((srv) => (
          <div key={srv.id} className="border p-3 rounded mb-2">
            <div><strong>{srv.title}</strong> — {srv.price} сум</div>
            <div className="text-sm">Категория: {srv.category}</div>
            <div className="text-sm">Даты: {srv.availability?.join(", ")}</div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEditService(srv)} className="text-blue-600 underline">Редактировать</button>
              <button onClick={() => handleDeleteService(srv.id)} className="text-red-600 underline">Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
