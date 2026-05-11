import { useEffect, useState } from "react";

export const Workers = () => {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/workers");
      const data = await res.json();
      setWorkers(data);
    } catch (err) {
      console.log("Error cargando workers");
    }
  };

  return (
    <div>
      <h2>Trabajadores</h2>

      {workers.map((w) => (
        <div key={w.id}>
          <h3>{w.user.nombre}</h3>
          <p>{w.descripcion}</p>
          <p>⭐ {w.rating}</p>
        </div>
      ))}
    </div>
  );
};

export default Workers;