import React, { useState } from 'react';

const languagesList = [
  'Русский', 'Английский', 'Узбекский', 'Французский', 'Немецкий',
  'Китайский', 'Японский', 'Итальянский', 'Испанский', 'Турецкий',
  'Арабский', 'Персидский', 'Индонезийский', 'Хинди', 'Польский',
  'Корейский', 'Португальский', 'Греческий', 'Латышский', 'Казахский'
];

function RegistrationForm() {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    location: '',
    contactPerson: '',
    email: '',
    phone: '',
    password: '',
    description: '',
    languages: [],
    images: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setFormData({ ...formData, images: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleLanguageChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(o => o.value);
    setFormData({ ...formData, languages: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'images') {
        Array.from(value || []).forEach(file => data.append('images', file));
      } else if (key === 'languages') {
        value.forEach(lang => data.append('languages', lang));
      } else {
        data.append(key, value);
      }
    });

    try {
      const res = await fetch('https://travella-production.up.railway.app/api/providers/register', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      alert(result.message || result.error || 'Что-то пошло не так');
    } catch (err) {
      console.error(err);
      alert('Ошибка при отправке');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold">Регистрация поставщика</h2>

      <select name="type" value={formData.type} onChange={handleChange} required className="w-full p-2 border rounded">
        <option value="">Выберите тип поставщика</option>
        <option value="гостиница">Гостиница</option>
        <option value="гид">Гид</option>
        <option value="транспорт">Транспорт</option>
        <option value="питание">Питание</option>
        <option value="мероприятие">Мероприятие/Событие</option>
        <option value="экскурсия">Экскурсия</option>
        <option value="достопримечательность">Достопримечательность</option>
      </select>

      <input name="name" value={formData.name} onChange={handleChange} placeholder="Название" className="w-full p-2 border rounded" required />
      <input name="location" value={formData.location} onChange={handleChange} placeholder="Локация" className="w-full p-2 border rounded" required />
      <input name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Контактное лицо (ФИО)" className="w-full p-2 border rounded" required />
      <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Номер телефона" className="w-full p-2 border rounded" required />

      {/* 💬 Языки */}
      <label className="block font-semibold">Языки:</label>
      <select multiple name="languages" value={formData.languages} onChange={handleLanguageChange} className="w-full p-2 border rounded h-40">
        {languagesList.map(lang => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>

      <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Пароль" className="w-full p-2 border rounded" required />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Описание" className="w-full p-2 border rounded" rows="4" />

      {/* 📷 Файлы */}
      <label className="block font-semibold">Фотографии:</label>
      <input name="images" type="file" accept=".jpg,.jpeg,.png" onChange={handleChange} multiple className="w-full p-2 border rounded" />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Зарегистрироваться</button>
    </form>
  );
}

export default RegistrationForm;
