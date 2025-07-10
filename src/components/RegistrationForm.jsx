import React, { useState } from 'react';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    location: '',
    contactPerson: '',
    email: '',
    phone: '',
    languages: [],
    password: '',
    description: '',
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLanguagesChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setFormData((prev) => ({ ...prev, languages: selected }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = new FormData();
    for (const key in formData) {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((val) => body.append(`${key}[]`, val));
      } else {
        body.append(key, formData[key]);
      }
    }

    images.forEach((file) => {
      body.append('images', file);
    });

    try {
      const res = await fetch('https://travella-production.up.railway.app/api/providers/register', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      alert(data.message || data.error || 'Успешно!');
    } catch (err) {
      console.error(err);
      alert('Ошибка при отправке');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">Регистрация поставщика</h2>

      <select name="type" value={formData.type} onChange={handleChange} required className="w-full p-2 border rounded">
        <option value="">Выберите тип</option>
        <option value="hotel">Гостиница</option>
        <option value="guide">Гид</option>
        <option value="transport">Транспорт</option>
        <option value="food">Питание</option>
        <option value="event">Мероприятие</option>
        <option value="tour">Экскурсия</option>
        <option value="attraction">Достопримечательность</option>
      </select>

      <input name="name" placeholder="Название" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded" />
      <input name="location" placeholder="Локация" value={formData.location} onChange={handleChange} required className="w-full p-2 border rounded" />
      <input name="contactPerson" placeholder="Контактное лицо" value={formData.contactPerson} onChange={handleChange} required className="w-full p-2 border rounded" />
      <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded" />
      <input name="phone" type="tel" placeholder="Телефон" value={formData.phone} onChange={handleChange} required className="w-full p-2 border rounded" />
      
      <label className="block">
        Фото (можно несколько):
        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="mt-2" />
      </label>

      <label className="block">
        Языки:
        <select multiple value={formData.languages} onChange={handleLanguagesChange} className="w-full p-2 border rounded mt-2">
          <option value="ru">Русский</option>
          <option value="uz">Узбекский</option>
          <option value="en">Английский</option>
          <option value="de">Немецкий</option>
          <option value="fr">Французский</option>
          <option value="fr">Китайский</option>
        </select>
      </label>

      <input name="password" type="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required className="w-full p-2 border rounded" />

      <textarea name="description" placeholder="Описание" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" rows={4} />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Зарегистрироваться</button>
    </form>
  );
}

export default RegistrationForm;
