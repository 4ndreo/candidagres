import React, { useEffect, useState, useContext } from "react";
import * as turnosService from "../../services/turnos.service";
import * as inscripcionesService from "../../services/inscripciones.service";

import { AuthContext } from "../../App";

import { useNavigate, useParams } from "react-router-dom";

export function CreateInscripcion({ title }) {
  const value = useContext(AuthContext);

  let navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [formaPago, setFormaPago] = useState("error");
  const [turnos, setTurnos] = useState([]);
  const [idTurno, setIdTurno] = useState("error");
  const [idCurso, setIdCurso] = useState("error");
  const [idUser, setIdUser] = useState(value.currentUser._id);
  const [error, setError] = useState("");

  useEffect(() => {
    turnosService.find().then((data) => {
      setTurnos(data);
      console.log(data);
    });
  }, []);

  useEffect(() => {
    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
  }, [idTurno]);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formaPago);
    if (formaPago !== "error" && idTurno !== "error") {
      inscripcionesService
        .create({ nombre, formaPago, idTurno, idUser, idCurso })
        .then((data) => {
          navigate("/inscripciones", { replace: true });
        })
        .catch((err) => setError(err.message));
    } else {
      window.alert("Tenes que seleccionar una forma de pago");
    }
  }

  function handleOption(idTurno) {
    console.log(idTurno);
    if (idTurno !== "error") {
      let result = turnos.filter((turno) => turno._id === idTurno);
      setIdTurno(result[0]._id);
      setIdCurso(result[0].idCurso);
      console.log(result[0]._id);
    } else {
    }
  }

  return (
    <main className="container edit-cont">
      <h1>Crear - {title}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Ingrese el Nombre del Alumno</label>
          <input
            type="text"
            required
            onChange={(e) => setNombre(e.target.value)}
            className="form-control"
          />
        </div>
        {/*<div className="mb-3">*/}
        {/*    <label className="form-label">Ingrese la forma de pago (efectivo o transferencia)</label>*/}
        {/*    <input*/}
        {/*        type="text"*/}
        {/*        required*/}
        {/*        onChange={(e) => setFormaPago(e.target.value)}*/}
        {/*        className="form-control"*/}
        {/*    />*/}
        {/*</div>*/}

        <div className="mb-3">
          <label htmlFor="cursos" className="form-label">
            Como desea pagar
          </label>
          <select
            name="cursos"
            id="cursos"
            form="cursosForm"
            className="form-control"
            onChange={(e) => setFormaPago(e.target.value)}
            required
          >
            <option value="error"> Seleccioná el turno...</option>
            <option value="transferencia"> Transferencia </option>
            <option value="efectivo"> Efectivo</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="cursos">A que turno pertenece</label>
          <select
            name="cursos"
            id="cursos"
            form="cursosForm"
            className="form-control"
            onChange={(e) => handleOption(e.target.value)}
          >
            <option value="error"> Seleccioná el turno...</option>
            {turnos.map((turno) => {
              return (
                <option key={turno._id} value={turno._id}>
                  {turno.dia} de {turno.horarioInicio}hs a {turno.horarioFin}hs
                </option>
              );
            })}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Crear
        </button>
      </form>
    </main>
  );
}
