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
    contact_name: '',
    email: '',
    phone: '',
    languages: [],
    password: '',
    description: '',
    images: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (e) => {
    const options = Array.from(e.target.selectedOptions);
    setFormData((prev) => ({
      ...prev,
      languages: options.map((opt) => opt.value)
    }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map(file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      }))
    )
      .then(base64Images => {
        setFormData(prev => ({
          ...prev,
          images: base64Images
        }));
      })
      .catch(err => {
        console.error('Ошибка при чтении файлов:', err);
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
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 mt-10 space-y-4 bg-white shadow-md rounded-2xl"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <h2 className="text-2xl font-bold text-[#FF5722]">Регистрация поставщика</h2>

      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded-xl bg-[#FFEAD2]"
      >
        <option value="">Выберите тип поставщика</option>
        <option value="гостиница">Гостиница</option>
        <option value="гид">Гид</option>
        <option value="транспорт">Транспорт</option>
        <option value="питание">Питание</option>
        <option value="мероприятие">Мероприятие/Событие</option>
        <option value="экскурсия">Экскурсия</option>
        <option value="достопримечательность">Достопримечательность</option>
      </select>

      <input name="name" value={formData.name} onChange={handleChange} placeholder="Название" className="w-full p-3 border rounded-xl bg-[#FFEAD2]" required />
      <input name="location" value={formData.location} onChange={handleChange} placeholder="Локация" className="w-full p-3 border rounded-xl bg-[#FFEAD2]" required />
      <input name="contact_name" value={formData.contact_name} onChange={handleChange} placeholder="Контактное лицо (ФИО)" className="w-full p-3 border rounded-xl bg-[#FFEAD2]" required />
      <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border rounded-xl bg-[#FFEAD2]" required />
      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Номер телефона" className="w-full p-3 border rounded-xl bg-[#FFEAD2]" required />

      <select
        multiple
        name="languages"
        onChange={handleLanguageChange}
        className="w-full p-3 border rounded-xl h-40 bg-[#FFEAD2]"
        value={formData.languages}
      >
        {languagesList.map(lang => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>

      <input type="file" multiple accept="image/jpeg,image/png" onChange={handleImagesChange} className="w-full p-3 rounded-xl bg-[#F1F1F1]" />

      <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Пароль" className="w-full p-3 border rounded-xl bg-[#FFEAD2]" required />

      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Описание" className="w-full p-3 border rounded-xl bg-[#FFEAD2]" rows="4" />

      <button
        type="submit"
        className="w-full py-3 px-6 bg-[#FF5722] text-white font-semibold rounded-xl hover:bg-[#FFAD7A] transition"
      >
        Зарегистрироваться
      </button>
    </form>
  );
}

export default RegistrationForm;
