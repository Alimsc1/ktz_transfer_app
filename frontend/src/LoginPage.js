import React, { useState } from "react";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("username", username);
    form.append("password", password);

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        throw new Error("Неверный логин или пароль");
      }

      const data = await res.json();
      const payload = JSON.parse(atob(data.access_token.split(".")[1])); // читаем токен
      const role = payload.role;

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", role);

      onLogin(role);
    } catch (err) {
      setError(err.message || "Ошибка входа");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 400 }}>
      <h2>🔐 Вход</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Войти
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LoginPage;
