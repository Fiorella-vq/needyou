import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Map } from "./Map";
import "../../styles/dashboard.css";

export const Dashboard = () => {
	const { store, actions } = useContext(Context);

	useEffect(() => {
		actions.getWorkers();
	}, []);

	return (
		<div className="container">

			<h2>Buscar profesionales</h2>

			<input placeholder="¿Qué oficio necesitás?" />

			<div className="workers-list">
				{store.workers.map((w) => (
					<div key={w.id} className="card">
						<h3>{w.user.nombre}</h3>
						<p>{w.descripcion}</p>
						<p>⭐ {w.rating}</p>
					</div>
				))}
			</div>

			{/* 🗺️ MAPA */}
			<h3 style={{ marginTop: "30px" }}>Profesionales cerca tuyo</h3>
			<Map workers={store.workers} />

		</div>
	);
};