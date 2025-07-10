import React, { useState } from 'react';

const allLanguages = [
  "Азербайджанский", "Английский", "Арабский", "Армянский", "Белорусский",
  "Бенгальский", "Бирманский", "Болгарский", "Вьетнамский", "Греческий",
  "Грузинский", "Иврит", "Индонезийский", "Испанский", "Итальянский",
  "Казахский", "Китайский", "Корейский", "Лаосский", "Малайский",
  "Монгольский", "Немецкий", "Персидский", "Польский", "Португальский",
  "Пушту", "Румынский", "Русский", "Сербский", "Словацкий",
  "Таджикский", "Тайский", "Турецкий", "Узбекский", "Украинский",
  "Французский", "Хинди", "Хорватский", "Чешский", "Японский"
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
    description: ''
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'select-multiple') {
      const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
      setFormData({ ...formData, [name]: selected });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10 space-y-4 p-4 border rounded">
      <h2 className="text-xl font-bold">Регистрация поставщика</h2>

      <select name="type" required onChange={handleChange} className="w-full p-2 border rounded">
        <option value="">Выберите тип поставщика</option>
        <option value="гостиница">Гостиница</option>
        <option value="гид">Гид</option>
        <option value="транспорт">Транспорт</option>
        <option value="питание">Питание</option>
        <option value="мероприятие">Мероприятие / Событие</option>
        <option value="экскурсия">Экскурсия</option>
        <option value="достопримечательность">Достопримечательность</option>
      </select>

      <input type="text" name="name" placeholder="Название" onChange={handleChange} required className="w-full p-2 border rounded" />
      <input type="text" name="location" placeholder="Локация" onChange={handleChange} required className="w-full p-2 border rounded" />
      <input type="text" name="contactPerson" placeholder="Контактное лицо (ФИО)" onChange={handleChange} required className="w-full p-2 border rounded" />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />
      <input type="tel" name="phone" placeholder="Номер телефона" onChange={handleChange} required className="w-full p-2 border rounded" />

      <select
        name="languages"
        multiple
        onChange={handleChange}
        className="w-full p-2 border rounded h-40"
      >
        {allLanguages.map(lang => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>

      <input type="password" name="password" placeholder="Пароль" onChange={handleChange} required className="w-full p-2 border rounded" />
      <textarea name="description" placeholder="Описание" onChange={handleChange} required className="w-full p-2 border rounded" />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Зарегистрироваться</button>
    </form>
  );
}

export default RegistrationForm;
