import "./css/Home.css";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as turnosService from "../services/turnos.service";

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    turnosService.find().then((data) => {
      setTurnos(data);
    });
  }, []);

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
                  <a href={`turnos/turno/id-${turno._id}`}>Editar un turno</a>
                </li>
              </ul>
            );
          })}
        </div>
      </div>
    </main>
  );
}
