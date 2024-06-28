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

    if (window.confirm("¿Esta seguro que quiere eliminar la clase?")) {
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
        <Link to="curso" className="btn btn-primary mt-3 btn-icon">
          <span className="pi pi-plus"></span>Crear una Clase
        </Link>
        <ul>
          {cursos.map((curso) => {
            // return <p>{curso.horario}</p>
            return (
              <li className="card mb-3" key={curso._id}>
                <div className="row g-0">
                  <div className="card-body col-md-8">
                    <small className="text-body-secondary">Profesor: {curso.profesor}</small>
                    <h5 className="card-title">{curso.nombre}</h5>
                    <p className="card-text">{curso.descripcion}</p>
                    <p> ${curso.precio}</p>
                  </div>
                  <div className="col-md-4 d-flex gap-2 align-items-end justify-content-end">
                    <Link
                      to={"curso/id-" + curso._id}
                      className="btn btn-warning btn-icon">
                      <span className="pi pi-pen-to-square"></span>Editar
                    </Link>
                    <button
                      onClick={() => handleDeleteElement(curso)}
                      className="btn btn-danger btn-icon"
                      type="button"
                      data-toggle="tooltip"
                      data-placement="top"
                      title=""
                      data-original-title="Delete">
                      <span className="pi pi-trash"></span>Eliminar
                    </button>
                  </div>
                </div>
              </li>
              // <li key={curso._id}>
              //   <p>Clase: {curso.nombre}</p>
              //   <p>Descripción: {curso.descripcion}</p>
              //   <p>Profesor: {curso.profesor}</p>
              //   <p>Precio: ${curso.precio} </p>
              //   <Link
              //     to={"curso/id-" + curso._id}
              //     className="btn btn-warning btn-editar me-2">
              //     <span>Editar clase</span>
              //   </Link>
              //   <button
              //     onClick={() => handleDeleteElement(curso)}
              //     className="btn btn-danger btn-eliminar"
              //     type="button"
              //     data-toggle="tooltip"
              //     data-placement="top"
              //     title=""
              //     data-original-title="Delete">
              //     <span>Eliminar Clase</span>
              //   </button>
              // </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
