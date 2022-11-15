import "./css/Cursos.css";

import React, { Component } from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as Constants from "../Constants";
import { AuthContext } from "../App";

import * as cursosService from "../services/cursos.service";
import Loader from "../components/basics/Loader";

export default function Header() {
  const [cursos, setCursos] = useState([]);

  const value = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    cursosService.find().then((data) => {
      setCursos(data);
    });
  }, []);
  if (cursos.length > 0) {
  return (
      <main className="container main">
        <div className="cont-cursos">
          <h1>Cursos disponibles</h1>
          <ul>
            {cursos.map((curso) => {
              // return <p>{curso.horario}</p>
              return (
                  <li key={curso._id}>
                    <p>Curso: {curso.nombre}</p>
                    <p>Descripción: {curso.descripcion}</p>
                    <p>Duración: {curso.duracion} horas</p>
                    <p>Precio: ${curso.precio}</p>
                    <p><a href={`turnos/turno/ver-${curso._id}`}>Ver Turnos Disponibles</a></p>
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

// export default Header;
