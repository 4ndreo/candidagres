import "./css/Cursos.css";

import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as cursosService from "../services/cursos.service";
import { AuthContext } from "../App";

export default function Turnos() {
  const [cursos, setCursos] = useState([]);

  const value = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    value.setCurrentUser(JSON.parse(localStorage.getItem("user")));
    if (!value.token) {
      navigate("/login", { replace: true });
    }
  }, []);

  useEffect(() => {
    cursosService.find().then((data) => {
      setCursos(data);
      // console.log(data)
    });
  }, []);

  function handleDeleteElement(item) {
    cursosService.remove(item._id).then((cursos) => {
      console.log(cursos);
      setCursos(cursos);
    });
  }

  return (
    <main className="container main m-0">
      <div className="cont-home">
        <h1 className="mt-4">Administrar Cursos</h1>
        <a href={"cursos/curso"} className="btn btn-primary mt-3">
          Crear un curso
        </a>
        <ul>
          {cursos.map((curso) => {
            // return <p>{curso.horario}</p>
            return (
              <li key={curso._id}>
                <p>Curso: {curso.nombre}</p>
                <p>Descripción: {curso.descripcion}</p>
                <p>Duración: {curso.duracion} horas</p>
                <p>Precio: ${curso.precio} </p>
                <a
                  href={`cursos/curso/id-${curso._id}`}
                  className="btn btn-warning btn-sm rounded-2 me-2"
                >
                  Editar curso
                </a>
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
