import React, { useEffect, useState } from "react";
import * as turnosService from "../../services/turnos.service";

export function CreateTurno({ title }) {
  const [dia, setDia] = useState("");
  const [horario, setHorario] = useState(9);
  const [error, setError] = useState("");

  useEffect(() => {}, []);

  function handleSubmit(e) {
    e.preventDefault();
    setHorario(Number(horario));
    turnosService
      .create({ dia, horario })
      .then((data) => {})
      .catch((err) => setError(err.message));
  }

  return (
    <main className="container edit-cont">
      <h1>Crear - {title}</h1>
      <form onSubmit={handleSubmit} className="mb-5">
        <div class="mb-3">
          <label className="form-label">Ingrese el dia del turno</label>
          <input
            type="text"
            value={dia}
            required
            onChange={(e) => setDia(e.target.value)}
            className="form-control"
          />
        </div>
        <div class="mb-3">
          <label className="form-label">A que hora comienza el turno</label>
          <input
            type="number"
            value={horario}
            required
            max={18}
            min={9}
            onChange={(e) => setHorario(e.target.value)}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Crear
        </button>
      </form>

      <h2>Vista previa del nuevo turno</h2>
      <p>El nuevo turno se imparte el {dia} a las {horario} horas</p>
      {error && <p>{error}</p>}
    </main>
  );
}
