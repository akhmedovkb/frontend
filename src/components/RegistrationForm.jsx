function RegistrationForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    // другие поля
  });

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
    <form onSubmit={handleSubmit}>
      {/* твоя форма */}
    </form>
  );
}

export default RegistrationForm;
