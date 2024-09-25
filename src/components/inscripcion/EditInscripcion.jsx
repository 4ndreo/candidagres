import "../css/Edit.css";
import React, { useEffect, useState, useContext } from "react";
import * as inscripcionesService from "../../services/inscripciones.service";
import * as turnosService from "../../services/turnos.service";
import * as cursosService from "../../services/cursos.service";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../App";
import Loader from "../basics/Loader";

export function EditInscripcion({ title }) {
  const value = useContext(AuthContext);

  let navigate = useNavigate();

  const [formaPago, setFormaPago] = useState("");
  const [nombre, setNombre] = useState("");
  const [icons, setIcons] = useState([]);
  const [turno, setTurno] = useState([]);
  const [curso, setCurso] = useState([]);
  const [error, setError] = useState("");
  const params = useParams();

  useEffect(() => {
    inscripcionesService
      .findById(params?.idInscripcion)
      .then((inscripcion) => {
        setFormaPago(inscripcion.formaPago);
        setNombre(inscripcion.nombre);
        setFormaPago("error");
        turnosService.findById(inscripcion.idTurno).then((turno) => {
          setTurno(turno);
          cursosService.findById(inscripcion.idCurso).then((curso) => {
            setCurso(curso);
          });
        });
      })
      .catch((err) => setError(err.message));

    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (formaPago !== "error") {
      inscripcionesService
        .update(params?.idInscripcion, { formaPago })
        .then((data) => {
          navigate("/inscripciones", { replace: true });
        });
    } else {
      window.alert("Tenes que seleccionar una forma de pago");
    }
  }
  if (nombre !== "" && turno._id && curso._id) {
    return (
      <main className="container edit-cont">
        <h1>Editar - {title}</h1>
        <h2 className="subtitle-edit">Datos de la inscripción</h2>
        <p>Alumno: {nombre}</p>
        <p>Curso: {curso.nombre}</p>
        <p>
          Turno: de {turno.horarioInicio}hs a {turno.horarioFin}hs.
        </p>
        <h2 className="subtitle-edit">Editar la inscripción</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="cursos">Método de pago</label>
            <select
              name="cursos"
              id="cursos"
              form="cursosForm"
              className="form-control"
              onChange={(e) => setFormaPago(e.target.value)}
              required
            >
              <option value="error"> Seleccioná el método de pago...</option>
              <option value="transferencia"> Transferencia </option>
              <option value="efectivo"> Efectivo</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Modificar
          </button>
        </form>
      </main>
    );
  } else {
    return (
      <main className="container">
        <Loader></Loader>
      </main>
    );
  }
}
