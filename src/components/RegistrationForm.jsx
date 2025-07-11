import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    password: '',
    description: '',
    location: '',
    languages: [],
    images: [],
  });

  const handleChange = (e) => {
    const { name, value, type: inputType, files } = e.target;

    if (inputType === 'file') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, images: [reader.result] });
      };
      reader.readAsDataURL(files[0]);
    } else if (name === 'languages') {
      const selected = Array.from(e.target.selectedOptions, (option) => option.value);
      setFormData({ ...formData, languages: selected });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/providers/register`, formData);
      alert('Поставщик успешно зарегистрирован!');
    } catch (error) {
      console.error('Ошибка при регистрации:', error.response?.data || error.message);
      alert('Ошибка при регистрации');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-brand-white p-8 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-brand-primary">Регистрация поставщика</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Тип услуги */}
        <select
          name="type"
          onChange={handleChange}
          value={formData.type}
          required
          className="w-full p-2 border rounded-md bg-brand-surface"
        >
          <option value="">Выберите тип</option>
          <option value="гид">Гид</option>
          <option value="транспорт">Транспорт</option>
          <option value="отель">Отель</option>
          <option value="питание">Питание</option>
          <option value="мероприятие">Мероприятие</option>
        </select>

        {/* Остальные поля */}
        <input name="name" value={formData.name} onChange={handleChange} required placeholder="Название компании" className="w-full p-2 border rounded-md" />
        <input name="contact_name" value={formData.contact_name} onChange={handleChange} required placeholder="Контактное лицо" className="w-full p-2 border rounded-md" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" className="w-full p-2 border rounded-md" />
        <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="Телефон" className="w-full p-2 border rounded-md" />
        <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Пароль" className="w-full p-2 border rounded-md" />
        <input name="location" value={formData.location} onChange={handleChange} required placeholder="Локация" className="w-full p-2 border rounded-md" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Описание" className="w-full p-2 border rounded-md" />
        
        {/* Языки */}
        <select name="languages" multiple onChange={handleChange} className="w-full p-2 border rounded-md bg-brand-surface">
          <option value="Русский">Русский</option>
          <option value="Английский">Английский</option>
          <option value="Узбекский">Узбекский</option>
        </select>

        {/* Фото */}
        <input type="file" name="images" accept="image/*" onChange={handleChange} className="w-full" />

        <button type="submit" className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-2 rounded-md transition">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
