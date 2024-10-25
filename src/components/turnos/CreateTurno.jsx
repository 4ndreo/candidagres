import "../css/Edit.css";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as turnosService from "../../services/shifts.service";
import * as classesService from "../../services/classes.service";
import { AuthContext } from "../../App";

export function CreateTurno({ title }) {
  const [nombre, setNombre] = useState("");
  const [dias, setDias] = useState([]);
  const [hora, setHora] = useState(9);
  const [horaFinalizar, setHoraFinalizar] = useState(10);
  const [minutos, setMinutos] = useState("");
  const [minutosFinalizar, setMinutosFinalizar] = useState("");
  const [cursos, setCursos] = useState([]);
  const [idCurso, setIdCurso] = useState("");
  const [max_turnos, setMax_turnos] = useState(0);
  const [mensajeError, setMensajeError] = useState('');
  const [error, setError] = useState("");

  const value = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    classesService.find().then((data) => {
      setCursos(data);
      console.log(data);
    });

    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const horarioInicio = hora + ':' + minutos
    const horarioFin = horaFinalizar + ':' + minutosFinalizar

    console.log(horarioInicio, horarioFin)
    console.log(hora, horaFinalizar)

    if (hora >= horaFinalizar){
      // window.alert("El horario de comienzo no puede ser menor al de finalizar")
      setMensajeError("La hora de finalización no puede ser menor o igual a la de inicio");
    } else {
      setMensajeError("");
      turnosService
          .create({ nombre, dias, horarioInicio, horarioFin, idCurso,max_turnos })
          .then((data) => {
            navigate("/panel/turnos", { replace: true });
          })
          .catch((err) => setError(err.message));
      console.log("entre")
    }
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

  function handleHoraChange(hora){
      setHora(hora)
  }

  function handleMinutosChange(minutos){

    if (minutos < 10){
      const newMinutos = "0" + minutos
      console.log(newMinutos.toString())
      setMinutos(newMinutos.toString())
    } else {
      console.log(hora.toString())
      const newMinutos = minutos.toString()
      setMinutos(newMinutos)
    }
  }
  function handleHoraFinalizarChange(horaFinalizar){

      console.log(horaFinalizar.toString())
      const newHora = horaFinalizar.toString()
      setMensajeError('');
      setHoraFinalizar(newHora)

  }
  function handleMinutosFinalizarChange(minutos){

    if (minutos < 10){
      const newMinutos = "0" + minutos
      console.log(newMinutos.toString())
      setMinutosFinalizar(newMinutos.toString())
    } else {
      console.log(hora.toString())
      const newMinutos = minutos.toString()
      setMinutosFinalizar(newMinutos)
    }
  }

  function handleDiasChange (e) {
    const opcionesSeleccionadas = Array.from(e.target.selectedOptions, (option) => option.value);
    setDias(opcionesSeleccionadas);
  }


  return (
    <main className="container edit-cont">
      <h1>Crear - {title}</h1>
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3">
          <label className="form-label" htmlFor="cursos">
            Ingresá la clase a la que pertenece el turno
          </label>
          <select

            required
            className="form-control"
            name="cursos"
            id="cursos"
            form="cursosForm"
            onChange={(e) => handleOption(e.target.value)}
          >
            <option value="error"> Seleccioná la clase...</option>
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
          <label className="form-label">Ingrese el nombre del turno</label>
          <input
              type="text"
              required
              onChange={(e) => setNombre(e.target.value)}
              className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ingrese la cantidad de alumnos</label>
          <input
              type="number"
              required
              onChange={(e) => setMax_turnos(parseInt(e.target.value))}
              className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ingresá el día del turno</label>
          <select
              value={dias}
              onChange={handleDiasChange}
              className="form-control"
              required
              multiple
          >
            <option value="D1">Lunes</option>
            <option value="D2">Martes</option>
            <option value="D3">Miércoles</option>
            <option value="D4">Jueves</option>
            <option value="D5">Viernes</option>
          </select>
        </div>
        <div className="mb-3">
          <span className="form-label">El turno comenzará a las</span>
          <input
            type="number"
            defaultValue={hora}
            required
            min={9}
            max={23}
            onChange={(e) =>handleHoraChange(e.target.value)}
            className="form-control input-horario"
          />
          :
          <input
            type="number"
            defaultValue={minutos}
            required
            min={0}
            max={59}
            onChange={(e) =>handleMinutosChange(e.target.value)}
            className="form-control input-horario"
          />
          hs, y terminará a las
          <input
              type="number"
              defaultValue={horaFinalizar}
              required
              min={10}
              max={23}
              onChange={(e) =>handleHoraFinalizarChange(e.target.value)}
              className="form-control input-horario"
          />
          :
          <input
              type="number"
              defaultValue={minutosFinalizar}
              required
              min={0}
              max={59}
              onChange={(e) =>handleMinutosFinalizarChange(e.target.value)}
              className="form-control input-horario"
          />
          hs.
          {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
        </div>

        <button type="submit" className="btn btn-primary">
          Crear
        </button>
      </form>
      {error && <p>{error}</p>}
    </main>
  );
}
