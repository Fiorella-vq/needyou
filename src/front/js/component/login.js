import React, { useState, useEffect } from "react";
import "../../styles/login.css";

export const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // persistencia modo oscuro
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);

        // 👉 redirección real
        window.location.href = "/dashboard";

      } else {
        setError(data.msg || "Credenciales incorrectas");
      }

    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className={`login-container ${darkMode ? "dark" : ""}`}>

      {/* Toggle modo */}
      <div className="top-bar">
        <button className="toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="login-card">
        <h2>Bienvenida a NeedYou</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button type="submit">Iniciar sesión</button>
        </form>

        {/* error */}
        {error && <p className="error">{error}</p>}

      </div>
    </div>
  );
};

export default Login;