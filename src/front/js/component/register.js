import React, { useState, useEffect } from "react";
import "../../styles/login.css";

export const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");

    try {
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.id) {
        setSuccess("Usuario creado correctamente ✨");

        // opcional: redirigir después de 1.5s
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);

      } else {
        setError(data.msg || "Error al registrarse");
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
        <h2>Crear cuenta</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) =>
              setForm({ ...form, nombre: e.target.value })
            }
            required
          />

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

          <button type="submit">Registrarse</button>
        </form>

        {/* mensajes */}
        {error && <p className="error">{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

      </div>
    </div>
  );
};

export default Register;