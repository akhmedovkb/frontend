import React, { useState } from 'react';

const allLanguages = [
  "Английский", "Русский", "Узбекский", "Казахский", "Таджикский",
  "Французский", "Немецкий", "Испанский", "Итальянский", "Португальский",
  "Турецкий", "Китайский", "Японский", "Корейский", "Арабский",
  "Хинди", "Бенгальский", "Персидский", "Пушту", "Иврит",
  "Греческий", "Польский", "Чешский", "Словацкий", "Румынский",
  "Сербский", "Хорватский", "Болгарский", "Украинский", "Белорусский",
  "Азербайджанский", "Грузинский", "Армянский", "Вьетнамский", "Индонезийский",
  "Малайский", "Тайский", "Лаосский", "Бирманский", "Монгольский"
];

const providerTypes = [
  "Гостиница", "Гид", "Транспорт", "Питание", "Мероприятие/Событие", "Экскурсия", "Достопримечательность"
];

function RegistrationForm() {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    location: '',
    contactName: '',
    email: '',
    phone: '',
    password: '',
    description: '',
    languages: [],
    images: [],
  });

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  const handleLanguageChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setFormData({ ...formData, languages: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (key === 'images') {
        formData.images.forEach((file) => data.append('images', file));
      } else if (key === 'languages') {
        formData.languages.forEach((lang) => data.append('languages', lang));
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
      alert(result.message || result.error || 'Успешно!');
    } catch (err) {
      console.error(err);
      alert('Ошибка при отправке');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold">Регистрация поставщика</h2>

      <select
        required
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        className="w-full p-2 border rounded"
      >
        <option value="">Тип поставщика</option>
        {providerTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Название"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Локация"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Контактное лицо (ФИО)"
        value={formData.contactName}
        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="tel"
        placeholder="Телефон"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="password"
        placeholder="Пароль"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />

      <textarea
        placeholder="Описание"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full p-2 border rounded"
        rows={4}
        required
      />

      <label className="block font-medium">Языки</label>
      <select
        multiple
        value={formData.languages}
        onChange={handleLanguageChange}
        className="w-full p-2 border rounded h-40"
      >
        {allLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      <label className="block font-medium">Фото / изображения</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="w-full p-2 border rounded"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Зарегистрироваться
      </button>
    </form>
  );
}

export default RegistrationForm;
