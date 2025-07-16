import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const token = localStorage.getItem("providerToken");

  useEffect(() => {
    if (!token) {
      console.log("Нет токена, редирект");
      return navigate("/login");
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://travella-production.up.railway.app/api/providers/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setProvider(data);
      } catch (error) {
        console.error("Ошибка при загрузке профиля:", error);
        navigate("/login");
      }
    };

    fetchData();
  }, [token, navigate]);

  if (!provider) return <div className="p-6">Загрузка...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Добро пожаловать, {provider.name}</h1>
      <p>Email: {provider.email}</p>
      {/* Добавь больше информации по мере необходимости */}
    </div>
  );
};

export default Dashboard;
