import "../css/Edit.css";
import React, { useEffect, useState, useContext } from "react";
import * as turnosService from "../../services/turnos.service";
import * as Constants from "../../Constants";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../App";

export function EditTurno({ title }) {
  let navigate = useNavigate();

  const [dia, setDia] = useState("");
  const [horarioInicio, setHorarioInicio] = useState();
  const [horarioFin, setHorarioFin] = useState();
  const [icons, setIcons] = useState([]);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState({});
  const params = useParams();

  const value = useContext(AuthContext);

  useEffect(() => {
    turnosService
      .findById(params?.idTurno)
      .then((turno) => {
        setDia(turno.dia);
        setHorarioInicio(turno.horarioInicio);
        setHorarioFin(turno.horarioFin);
      })
      .catch((err) => setError(err.message));

      if (value.currentUser.role !== 1) {
        navigate("/", { replace: true });
      }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    turnosService.update(params?.idTurno, { dia, horarioInicio, horarioFin }).then((data) => {
      navigate("/turnos", { replace: true });
    });
  }

  return (
    <main className="container edit-cont">
      <h1>Editar - {title}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Ingrese el dia del turno</label>
          <input
            type="text"
            defaultValue={dia}
            required
            onChange={(e) => setDia(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
        <span className="form-label">El turno comenzará a las</span>
          <input
            type="number"
            defaultValue={horarioInicio}
            required
            max={18}
            min={9}
            onChange={(e) => setHorarioInicio(e.target.value)}
            className="form-control input-horario"
          />
          hs, y terminará a las
          <input
            type="number"
            defaultValue={horarioFin}
            required
            max={18}
            min={9}
            onChange={(e) => setHorarioFin(e.target.value)}
            className="form-control input-horario"
          />
          hs.
        </div>
        <button type="submit" className="btn btn-primary">
          Modificar
        </button>
      </form>
      {error && <p>{error}</p>}
    </main>
  );
}
