import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
	const { store } = useContext(Context);
	const [darkMode, setDarkMode] = useState(false);

	// Persistir modo oscuro
	useEffect(() => {
		const saved = localStorage.getItem("darkMode");
		if (saved === "true") setDarkMode(true);
	}, []);

	useEffect(() => {
		localStorage.setItem("darkMode", darkMode);
	}, [darkMode]);

	return (
		<div className={`home ${darkMode ? "dark" : ""}`}>

			{/* Toggle modo */}
			<div className="top-bar">
				<button className="toggle" onClick={() => setDarkMode(!darkMode)}>
					{darkMode ? "☀️ Claro" : "🌙 Oscuro"}
				</button>
			</div>

			{/* Hero */}
			<div className="hero">
				<h1 className="title">NeedYou</h1>
				<p className="subtitle">
					Encontrá profesionales cerca tuyo en segundos
				</p>
			</div>

			{/* Botones separados */}
			<div className="buttons">
				<a href="/login">
					<button className="btn pastel-blue">Iniciar sesión</button>
				</a>

				<a href="/register">
					<button className="btn pastel-purple">Registrarse</button>
				</a>
			</div>

			{/* Mensaje opcional backend */}
			<div className="info">
				{store.message || "Bienvenida a NeedYou ✨"}
			</div>

		</div>
	);
};