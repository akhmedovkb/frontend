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
    languages: [],
    password: '',
    description: '',
    images: [] // тут будут base64 строки
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setFormData((prev) => ({ ...prev, languages: selected }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(base64Images => {
      setFormData((prev) => ({ ...prev, images: base64Images }));
    }).catch(() => {
      alert('Ошибка при чтении изображений');
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://travella-production.up.railway.app/api/providers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      alert(data.message || data.error || 'Что-то пошло не так');
    } catch (err) {
      console.error(err);
      alert('Ошибка при отправке');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold">Регистрация поставщика</h2>

      <select name="type" value={formData.type} onChange={handleChange} required className="w-full p-2 border rounded">
        <option value="">Тип поставщика</option>
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

      <select multiple name="languages" onChange={handleLanguageChange} className="w-full p-2 border rounded h-40">
        {languagesList.map(lang => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>

      <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Пароль" className="w-full p-2 border rounded" required />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Описание" className="w-full p-2 border rounded" rows="4" />

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        className="w-full p-2 border rounded"
      />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Зарегистрироваться</button>
    </form>
  );
}

export default RegistrationForm;
