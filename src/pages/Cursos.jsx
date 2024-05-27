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
              return (
                <li class="card" key={curso._id}>
                  <div class="card-body">
                    <h2 class="card-title">{curso.nombre}</h2>
                    <p class="card-subtitle mb-2 text-body-secondary negritas">Precio: ${curso.precio}</p>
                    <p class="card-text">{curso.descripcion}</p>
                    <Link to={"/turnos/turno/ver-" + curso._id}
                      className="btn btn-primary btn-ver"> <span>Ver turnos disponibles</span></Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    );
  }
  else {
    return (
      <main className="container main">
        <Loader></Loader>
      </main>
    )
  }
}

// export default Header;
