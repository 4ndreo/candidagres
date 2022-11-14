import "./css/Home.css";

import React, { Component } from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as Constants from "../Constants";
import { AuthContext } from "../App";

import * as cursosService from "../services/cursos.service";

export default function Header() {
  const [cursos, setCursos] = useState([]);

  const value = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    cursosService.find().then((data) => {
      setCursos(data);
    });
  }, []);
  // if ((!value.token && !value.currentUser) || value.currentUser) {
  return (
      <main className="container main">
        <div className="cont-home">
          <h1 className="mt-4">Cursos disponibles</h1>
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
  // }
}

// export default Header;
