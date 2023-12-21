import "./css/Cursos.css";

import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as cursosService from "../../services/cursos.service";
import { AuthContext } from "../../App";
import * as inscripcionesService from "../../services/inscripciones.service";

export default function Turnos() {
  const [cursos, setCursos] = useState([]);

  const value = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    cursosService.find().then((data) => {
      setCursos(data);
    });
  }, []);

  function handleDeleteElement(item) {

    if(window.confirm("¿Esta seguro que quiere eliminar la clase?")){
      cursosService.remove(item._id).then((cursos) => {
        console.log(cursos);
        setCursos(cursos);
      });

    }


  }

  return (
    <main className="container main">
      <div className="cont-admin-cursos">
        <h1>Administrar Clases</h1>
        <Link to="curso" className="btn btn-primary mt-3">
          Crear una Clase
        </Link>
        <ul>
          {cursos.map((curso) => {
            // return <p>{curso.horario}</p>
            return (
              <li key={curso._id}>
                <p>Clase: {curso.nombre}</p>
                <p>Descripción: {curso.descripcion}</p>
                <p>Profesor: {curso.profesor}</p>
                <p>Precio: ${curso.precio} </p>
                <Link
                  to={"curso/id-" + curso._id}
                  className="btn btn-warning me-2"
                >
                  Editar clase
                </Link>
                <button
                  onClick={() => handleDeleteElement(curso)}
                  className="btn btn-danger"
                  type="button"
                  data-toggle="tooltip"
                  data-placement="top"
                  title=""
                  data-original-title="Delete"
                >
                  <i className="fa fa-trash-o" aria-hidden="true"></i>
                  Eliminar Clase
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
