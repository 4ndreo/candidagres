import "../css/Edit.css";
import React, { useEffect, useState } from "react";
import * as turnosService from "../../services/turnos.service";
import * as Constants from "../../Constants";
import { useNavigate, useParams } from "react-router-dom";

export function EditTurno({ title }) {
  let navigate = useNavigate();

  const [dia, setDia] = useState("");
  const [horario, setHorario] = useState();
  const [icons, setIcons] = useState([]);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState({});
  const params = useParams();

  useEffect(() => {
    turnosService
      .findById(params?.idTurno)
      .then((turno) => {
        console.log(turno.dia);
        console.log(turno.horario);
        setHorario(turno.horario);
        setDia(turno.dia);
        console.log(turno.dia);
        console.log(turno.horario);
      })
      .catch((err) => setError(err.message));
  }, []);


  function handleSubmit(e) {
    e.preventDefault();
    turnosService.update(params?.idTurno, { dia, horario }).then((data) => {
      setDia(data[0].dia);
    });

    navigate("/cursos", { replace: true });
  }

  return (
    <main className="container edit-cont">
      <h1>Editar - {title}</h1>
      <form onSubmit={handleSubmit}>
        <label>Nuevo dia</label>
        <div className="d-flex">
          <label>Ingrese el dia del turno</label>
          <input
            type="text"
            defaultValue={dia}
            required
            onChange={(e) => setDia(e.target.value)}
          />

          <label>A que hora comienza el turno</label>
          <input
            type="number"
            defaultValue={horario}
            required
            max={18}
            min={9}
            onChange={(e) => setHorario(e.target.value)}
          />

          <button type="submit">Crear</button>
        </div>
      </form>
      {error && <p>{error}</p>}
    </main>
  );
}
