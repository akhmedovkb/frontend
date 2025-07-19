
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    type: "",
    languages: "",
    location: "",
    rating: "",
    reviews: "",
    images: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://travella-api-production.up.railway.app/api/providers/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Регистрация успешна!");
      navigate("/dashboard");
    } else {
      alert("Ошибка при регистрации");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-2">
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Пароль" onChange={handleChange} required />
      <input type="text" name="name" placeholder="Имя" onChange={handleChange} />
      <input type="text" name="type" placeholder="Тип услуги" onChange={handleChange} />
      <input type="text" name="languages" placeholder="Языки" onChange={handleChange} />
      <input type="text" name="location" placeholder="Локация" onChange={handleChange} />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Зарегистрироваться</button>
    </form>
  );
};

export default RegistrationForm;
