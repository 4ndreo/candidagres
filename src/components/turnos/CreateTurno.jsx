import React, { useEffect, useState } from "react";
import * as turnosService from "../../services/turnos.service";
import * as cursosService from "../../services/cursos.service";

export function CreateTurno({ title }) {
  const [dia, setDia] = useState("");
  const [horario, setHorario] = useState(9);
  const [cursos, setCursos] = useState([]);
  const [idCurso, setidCurso] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    cursosService.find().then((data) => {
      setCursos(data);
      console.log(data)
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setHorario(Number(horario));
    turnosService
      .create({ dia, horario, idCurso })
      .then((data) => {})
      .catch((err) => setError(err.message));
  }

  function handleOption(nombreCurso){
    console.log(nombreCurso)
    let result = cursos.filter(curso => curso.nombre === nombreCurso)
    setidCurso(result[0]._id)
    console.log(result[0]._id)
  }

  return (
    <main className="container edit-cont">
      <h1>Crear - {title}</h1>
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3">
          <label className="form-label">Ingrese el dia del turno</label>
          <input
            type="text"
            value={dia}
            required
            onChange={(e) => setDia(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
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

        <div>
          <label htmlFor="cursos">A que curso pertenece el turno</label>
          <select
              name="cursos"
              id="cursos"
              form="cursosForm"
              onChange={e => handleOption(e.target.value)}
            >
            <option> Selecciona el curso...-</option>
            {cursos.map((curso) => {
              return (
              <option
                  key={curso._id}
                  value={curso.nombre}
                  > {curso.nombre} </option>
              );
            })}

          </select>
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
