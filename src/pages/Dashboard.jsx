
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
        const iso = new Date(curr).toISOString().split("T")[0];
        if (!newService.availability.includes(iso)) {
          dates.push(iso);
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

  return <div>/* UI markup skipped for brevity */</div>;
};

export default Dashboard;
