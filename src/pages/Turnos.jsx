import "./css/Home.css";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as turnosService from "../services/turnos.service";

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    turnosService.find().then((data) => {
      setTurnos(data);
    });
  }, []);

  function handleDeleteElement(item) {
    turnosService.remove(item._id).then((turnos) => {
      console.log(turnos)
      setTurnos(turnos);
    });
  }

  return (
    <main className="container main m-0">
      <div className="d-flex cont-home">
        <a href={"turnos/turno"}>Crear un turno</a>
        <div>
          {turnos.map((turno) => {
            // return <p>{turno.horario}</p>
            return (
              <ul>
                <li>
                  <p>
                    Turno: {turno.dia} / Horario: {turno.horario}
                  </p>
                  <a href={`turnos/turno/id-${turno._id}`}>Editar turno</a>
                  <button
                    onClick={() => handleDeleteElement(turno)}
                    className="btn btn-danger btn-sm rounded-0"
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
              </ul>
            );
          })}
        </div>
      </div>
    </main>
  );
}
