import "../css/Edit.css";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as turnosService from "../../services/turnos.service";
import * as cursosService from "../../services/cursos.service";
import { AuthContext } from "../../App";

export function CreateTurno({ title }) {
  const [dia, setDia] = useState("");
  const [horarioInicio, setHorarioInicio] = useState(0);
  const [horarioFin, setHorarioFin] = useState(0);
  const [cursos, setCursos] = useState([]);
  const [idCurso, setIdCurso] = useState("");
  const [error, setError] = useState("");

  const value = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    cursosService.find().then((data) => {
      setCursos(data);
      console.log(data);
    });

    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setHorarioInicio(Number(horarioInicio));
    setHorarioFin(Number(horarioFin));
    turnosService
      .create({ dia, horarioInicio, horarioFin, idCurso })
      .then((data) => {
        navigate("/panel/turnos", { replace: true });
      })
      .catch((err) => setError(err.message));
  }

  function handleOption(nombreCurso) {
    console.log(nombreCurso);
    if (nombreCurso !== "error") {
      let result = cursos.filter((curso) => curso.nombre === nombreCurso);
      setIdCurso(result[0]._id);
      console.log(result[0]._id);
    } else {
    }
  }

  return (
    <main className="container edit-cont">
      <h1>Crear - {title}</h1>
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3">
          <label className="form-label" htmlFor="cursos">
            Ingresá el curso al que pertenece el turno
          </label>
          <select
            className="form-control"
            name="cursos"
            id="cursos"
            form="cursosForm"
            onChange={(e) => handleOption(e.target.value)}
          >
            <option value="error"> Seleccioná el curso...</option>
            {cursos.map((curso) => {
              return (
                <option key={curso._id} defaultValue={curso.nombre}>
                  {curso.nombre}
                </option>
              );
            })}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Ingresá el día del turno</label>
          <input
            type="text"
            required
            onChange={(e) => setDia(e.target.value)}
            className="form-control"
            placeholder="Lunes, Martes, Miércoles..."
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
          Crear
        </button>
      </form>
      {error && <p>{error}</p>}
    </main>
  );
}
