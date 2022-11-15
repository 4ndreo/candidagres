import "../css/Cursos.css";

import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as cursosService from "../../services/cursos.service";
import { AuthContext } from "../../App";

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
    cursosService.remove(item._id).then((cursos) => {
      console.log(cursos);
      setCursos(cursos);
    });
  }

  return (
    <main className="container main">
      <div className="cont-crear-curso">
        <h1>Administrar Cursos</h1>
        <Link to="curso" className="btn btn-primary mt-3">Crear un Curso</Link>
        <ul>
          {cursos.map((curso) => {
            // return <p>{curso.horario}</p>
            return (
              <li key={curso._id}>
                <p>Curso: {curso.nombre}</p>
                <p>Descripción: {curso.descripcion}</p>
                <p>Duración: {curso.duracion} horas</p>
                <p>Precio: ${curso.precio} </p>
                <Link
                  to={"curso/id-" + curso._id}
                  className="btn btn-warning btn-sm rounded-2 me-2"
                >Editar curso</Link>
                <button
                  onClick={() => handleDeleteElement(curso)}
                  className="btn btn-danger btn-sm rounded-2"
                  type="button"
                  data-toggle="tooltip"
                  data-placement="top"
                  title=""
                  data-original-title="Delete"
                >
                  <i className="fa fa-trash-o" aria-hidden="true"></i>
                  Eliminar curso
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
