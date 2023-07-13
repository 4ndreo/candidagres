import "./VerTurnos.css";

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
          <ul className="cont-listado-dias">
            {diasSemana.map((diaSemana) => {
              return (
                <li key={diaSemana.id} className="item-dia">
                  <h2> {diaSemana.nombre}</h2>
                  <ul className="cont-TarjetaTurnos">
                    {turnos.map((turno) => {
                      if (turno.dias.some((dia) => dia === diaSemana.id)) {
                        return (
                          <TarjetaTurno
                            key={turno._id}
                            turno={turno}
                            horInicio={turno.horarioInicio}
                            horFin={turno.horarioFin}
                            color={turno.color}
                          />
                        );
                      }
                    })}
                  </ul>
                </li>
              );
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
