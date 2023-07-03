import "../../pages/css/Turnos.css";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import * as turnosService from "../../services/turnos.service";
import * as cursosService from "../../services/cursos.service";
import Loader from "../basics/Loader";
import TarjetaTurno from "../tarjeta-turno/TarjetaTurno";

export function VerTurnos() {
  let navigate = useNavigate();

  const [turnos, setTurnos] = useState([]);
  const [curso, setCurso] = useState();
  const [error, setError] = useState([]);
  const diasSemana = [
    {
      id: "D1",
      nombre: "Lunes",
    },
    {
      id: "D2",
      nombre: "Martes",
    },
    {
      id: "D3",
      nombre: "Miércoles",
    },
    {
      id: "D4",
      nombre: "Jueves",
    },
    {
      id: "D5",
      nombre: "Viernes",
    },
    {
      id: "D6",
      nombre: "Sábado",
    },
    {
      id: "D7",
      nombre: "Domingo",
    },
  ];
  const params = useParams();

  useEffect(() => {
    turnosService.find().then((data) => {
      setTurnos(
        data.sort(function (a, b) {
          return a.horarioInicio - b.horarioInicio;
        })
      );
      cursosService
        .findById(params?.idCurso)
        .then((curso) => {
          setCurso(curso);
        })
        .catch((err) => setError(err.message));
        // console.log(params?.idCurso)
      });
    }, []);

    if (curso && turnos.length > 0) {
      return (
        <main className="container main">
        <div className="cont-turno">
          <h1>Turnos disponibles para la clase "{curso.nombre}"</h1>
          <ul className="cont-listado-dias d-flex">
            {diasSemana.map((diaSemana) => {
              return (
                <li key={diaSemana.id} className="item-dia w-100">
                  {diaSemana.nombre}
                  <ul>
                    {turnos.map((turno) => {
                      
                      if (turno.dias.some((dia) => dia === diaSemana.id)) {
                        return (
                          <TarjetaTurno key={turno._id} turno={turno} />
                        );
                      }
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
          {/* <ul>
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
        </ul> */}
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
