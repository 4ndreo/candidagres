import "../../pages/css/Turnos.css";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import * as turnosService from "../../services/turnos.service";
import * as cursosService from "../../services/cursos.service";
import Loader from "../basics/Loader";

export function VerTurnos() {
  let navigate = useNavigate();

  const [turnos, setTurnos] = useState([]);
  const [curso, setCurso] = useState();
  const [error, setError] = useState([]);
  const params = useParams();

  useEffect(() => {
    turnosService.find().then((data) => {
      setTurnos(data.sort(function(a, b) {
        return a.horarioInicio - b.horarioInicio;
      }));
      cursosService
        .findById(params?.idCurso)
        .then((curso) => {
          setCurso(curso);
        })
        .catch((err) => setError(err.message));
      // console.log(data)
      // console.log(params?.idCurso)
    });
  }, []);
if(curso && turnos.length > 0) {
  return (
    <main className="container main">
      <div className="cont-turno">
        <h1>Turnos disponibles para la clase "{curso.nombre}"</h1>
        <ul>
          {turnos.map((turno) => {
            if (turno.idCurso === params?.idCurso) {
              return (
                <li key={turno._id}>
                  <p>Dia del turno: {turno.dia}</p>
                  <p>
                    Horario: de {turno.horarioInicio}hs a {turno.horarioFin}hs
                  </p>
                  <Link
                    to={"/id-" + turno._id + "/curso/id-" + turno.idCurso}
                    className="btn btn-primary"
                  >
                    Inscribirse en este horario
                  </Link>
                </li>
              );
            }
          })}
        </ul>
      </div>
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
