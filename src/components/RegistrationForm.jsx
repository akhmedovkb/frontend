import React, { useState } from 'react';

const providerTypes = [
  'Гостиница',
  'Гид',
  'Транспорт',
  'Питание',
  'Мероприятие/Событие',
  'Экскурсия',
  'Достопримечательность',
];

const languages = [
  'Русский',
  'Узбекский',
  'Английский',
  'Немецкий',
  'Французский',
];

function RegistrationForm() {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    location: '',
    contactName: '',
    email: '',
    phone: '',
    images: [],
    languages: [],
    password: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLanguagesChange = (e) => {
    const { options } = e.target;
    const selected = [];
    for (const option of options) {
      if (option.selected) selected.push(option.value);
    }
    setFormData({ ...formData, languages: selected });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      if (key === 'images') {
        formData.images.forEach((file) => data.append('images', file));
      } else if (Array.isArray(formData[key])) {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const res = await fetch('https://travella-production.up.railway.app/api/providers/register', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      alert(result.message || result.error || 'Успешно отправлено');
    } catch (err) {
      console.error(err);
      alert('Ошибка при отправке');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold">Регистрация поставщика</h2>

      <select name="type" onChange={handleChange} required className="w-full p-2 border rounded">
        <option value="">Выберите тип поставщика</option>
        {providerTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <input name="name" placeholder="Название" onChange={handleChange} required className="w-full p-2 border rounded" />
      <input name="location" placeholder="Локация" onChange={handleChange} required className="w-full p-2 border rounded" />
      <input name="contactName" placeholder="Контактное лицо (ФИО)" onChange={handleChange} required className="w-full p-2 border rounded" />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />
      <input name="phone" placeholder="Номер телефона" onChange={handleChange} required className="w-full p-2 border rounded" />

      <input name="images" type="file" accept="image/*" multiple onChange={handleFileChange} className="w-full" />

      <select name="languages" multiple onChange={handleLanguagesChange} className="w-full p-2 border rounded">
        {languages.map((lang) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>

      <input name="password" type="password" placeholder="Пароль" onChange={handleChange} required className="w-full p-2 border rounded" />
      <textarea name="description" placeholder="Описание" onChange={handleChange} className="w-full p-2 border rounded" rows="4" />

      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Зарегистрироваться</button>
    </form>
  );
}

export default RegistrationForm;
