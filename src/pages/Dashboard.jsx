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

  if (!provider) return <div className="p-6">Загрузка...</div>;

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-6 gap-6">
      {/* Левая колонка: Профиль */}
      <div className="w-full md:w-1/3 bg-white rounded-xl shadow p-6 space-y-4">
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 underline mb-4"
        >
          Выйти
        </button>
        {provider.images?.[0] && (
          <img
            src={provider.images[0]}
            alt="Фото"
            className="w-32 h-32 rounded-full object-cover mx-auto"
          />
        )}
        <div className="text-center font-bold text-xl">{provider.name}</div>
        <div className="text-center text-gray-500">{provider.languages?.join(", ")}</div>

        <div>
          <label className="font-medium">Тип:</label>
          <div>{provider.type}</div>
        </div>
        <div>
          <label className="font-medium">Локация:</label>
          <div>{provider.location}</div>
        </div>
        <div>
          <label className="font-medium">Контакт:</label>
          <div>{provider.contact_name}</div>
          <div>{provider.phone}</div>
          <div>{provider.email}</div>
        </div>
        <div>
          <label className="font-medium">Описание:</label>
          <div>{provider.description}</div>
        </div>
      </div>

      {/* Правая колонка: Управление услугами */}
      <div className="w-full md:w-2/3 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Добавить услугу</h2>
        <input name="title" placeholder="Заголовок" value={newService.title} onChange={handleServiceChange} className="w-full mb-2 p-2 border rounded" />
        <input name="description" placeholder="Описание" value={newService.description} onChange={handleServiceChange} className="w-full mb-2 p-2 border rounded" />
        <input name="price" placeholder="Цена" value={newService.price} onChange={handleServiceChange} className="w-full mb-2 p-2 border rounded" />
        <input name="category" placeholder="Категория" value={newService.category} onChange={handleServiceChange} className="w-full mb-2 p-2 border rounded" />

        <div className="mb-2">
          <label className="block font-medium">Доступность по датам:</label>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            isClearable={true}
            inline
          />
          <button
            onClick={handleAddAvailability}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
          >
            Добавить даты
          </button>
          <div className="text-sm text-gray-600 mt-2">
            Выбрано: {newService.availability.join(", ")}
          </div>
        </div>

        <button
          onClick={handleAddService}
          className="bg-primary text-white px-4 py-2 rounded mt-4"
        >
          Сохранить услугу
        </button>

        <hr className="my-6" />

        <h2 className="text-xl font-bold mb-2">Мои услуги</h2>
        {services.map((srv) => (
          <div key={srv.id} className="border p-3 rounded mb-2">
            <div><strong>{srv.title}</strong> — {srv.price} сум</div>
            <div className="text-sm">Категория: {srv.category}</div>
            <div className="text-sm">Доступные даты: {srv.availability?.join(", ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
