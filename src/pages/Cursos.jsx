import "./css/Cursos.css";

import React, { Component } from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
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
          <h1>Clases disponibles</h1>
          <ul className="listado-cursos">
            {cursos.map((curso) => {
              // return <p>{curso.horario}</p>
              return (
                  <li key={curso._id}>
                    <h2>Clase: {curso.nombre}</h2>
                    <p>Descripción: {curso.descripcion}</p>
                    <p>Duración: {curso.duracion} horas</p>
                    <p>Precio: ${curso.precio}</p>
                    <p><Link to={"/turnos/turno/ver-" + curso._id} className="btn btn-primary">Ver turnos disponibles</Link></p>
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
