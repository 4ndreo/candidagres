import "./css/Cursos.css";

import React from "react";
import { useState, useEffect } from "react";


import * as cursosService from "../services/cursos.service";
import Loader from "../components/basics/Loader";
import { ClaseDisponible } from "../components/cursos/clase-disponible/ClaseDisponible";

export default function Header() {
  const [cursos, setCursos] = useState([]);

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
                <li class="card">
                  <ClaseDisponible data={curso}></ClaseDisponible>
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
