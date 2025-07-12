import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://travella-production.up.railway.app/api/providers/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        // ✅ сохраняем с правильным ключом
        localStorage.setItem("providerToken", data.token);
        console.log("Успешный вход, токен:", data.token);
        navigate("/dashboard");
      } else {
        alert(data.error || "Ошибка входа");
      }
    } catch (error) {
      console.error("Ошибка при входе:", error);
      alert("Сервер не отвечает");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Вход поставщика</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full p-3 border rounded-xl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-xl hover:bg-secondary transition"
        >
          Войти
        </button>
      </form>
    </div>
  );
};

export default Login;
