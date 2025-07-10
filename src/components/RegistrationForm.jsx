const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('https://travella-production.up.railway.app/api/register', {
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
