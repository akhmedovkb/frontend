import React, { useState } from "react";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    contact_name: "",
    email: "",
    phone: "",
    password: "",
    description: "",
    location: "",
    languages: [],
    images: [],
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const files = Array.from(e.target.files);
      const readers = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((base64files) => {
        setFormData({ ...formData, images: base64files });
      });
    } else if (name === "languages") {
      const values = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData({ ...formData, languages: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("https://your-api-url.com/api/providers/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    alert(result.message || "Регистрация прошла успешно!");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-bold text-primary mb-6">Регистрация поставщика</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="type" onChange={handleChange} required className="w-full p-3 border rounded-xl bg-block">
          <option value="">Тип услуги</option>
          <option value="транспорт">Транспорт</option>
          <option value="гид">Гид</option>
          <option value="отель">Отель</option>
          <option value="питание">Питание</option>
          <option value="достопримечательность">Достопримечательность</option>
          <option value="мероприятие">Мероприятие</option>
        </select>

        <input name="name" placeholder="Название компании" onChange={handleChange} required className="w-full p-3 border rounded-xl bg-block" />
        <input name="contact_name" placeholder="Контактное лицо" onChange={handleChange} required className="w-full p-3 border rounded-xl bg-block" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-3 border rounded-xl bg-block" />
        <input type="tel" name="phone" placeholder="Телефон" onChange={handleChange} required className="w-full p-3 border rounded-xl bg-block" />
        <input type="password" name="password" placeholder="Пароль" onChange={handleChange} required className="w-full p-3 border rounded-xl bg-block" />
        <input name="location" placeholder="Локация" onChange={handleChange} required className="w-full p-3 border rounded-xl bg-block" />
        <textarea name="description" placeholder="Описание" onChange={handleChange} required className="w-full p-3 border rounded-xl bg-block" />

        <select multiple name="languages" onChange={handleChange} className="w-full p-3 border rounded-xl bg-block">
          <option value="Русский">Русский</option>
          <option value="Английский">Английский</option>
          <option value="Узбекский">Узбекский</option>
        </select>

        <input type="file" multiple accept="image/*" onChange={handleChange} className="w-full p-3 bg-block rounded-xl" />

        <button type="submit" className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-secondary transition">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
