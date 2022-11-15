import "../css/Turnos.css";

import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as turnosService from "../../services/turnos.service";
import { AuthContext } from "../../App";
import Loader from "../../components/basics/Loader";

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);

  const value = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    turnosService.find().then((data) => {
      setTurnos(data);
    });
  }, []);

  function handleDeleteElement(item) {
    turnosService.remove(item._id).then((turnos) => {
      console.log(turnos);
      setTurnos(turnos);
    });
  }

  if (turnos.length > 0) {
  return (
    <main className="container main">
      <div className="cont-admin-turnos">
      <h1>Administrar Turnos</h1>
        <Link to="turno" className="btn btn-primary mt-3">Crear un turno</Link>
        <ul>
          {turnos.map((turno) => {
            // return <p>{turno.horario}</p>
            return (
              <li key={turno._id}>
                <p>
                  Turno: {turno.dia} / Horario: {turno.horario}
                </p>
                <Link
                  to={"turno/id-" + turno._id}
                  className="btn btn-warning btn-sm rounded-2 me-2"
                >
                  Editar turno
                </Link>
                <button
                  onClick={() => handleDeleteElement(turno)}
                  className="btn btn-danger btn-sm rounded-2"
                  type="button"
                  data-toggle="tooltip"
                  data-placement="top"
                  title=""
                  data-original-title="Delete"
                >
                  <i className="fa fa-trash-o" aria-hidden="true"></i>
                  Eliminar turno
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
else 
{
  return (
    <main className="container main">
      <Loader></Loader>
    </main>
  )
}
}
