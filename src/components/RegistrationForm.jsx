// src/components/RegistrationForm.jsx
import React, { useState } from "react";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    type: "",
    location: "",
    languages: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "https://travella-production.up.railway.app/api/providers/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    const data = await response.json();
    if (response.ok) {
      alert("Регистрация успешна");
    } else {
      alert(data.error || "Ошибка регистрации");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Регистрация поставщика</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Имя" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="password" type="password" placeholder="Пароль" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="type" placeholder="Тип услуги" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="location" placeholder="Локация" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="languages" placeholder="Языки (через запятую)" onChange={handleChange} required className="w-full border p-2 rounded" />
        <button type="submit" className="bg-primary text-white py-2 px-4 rounded">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
