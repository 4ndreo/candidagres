import "./css/Turnos.css";

import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import * as turnosService from "../../services/turnos.service";
import * as cursosService from "../../services/cursos.service";
import { AuthContext } from "../../App";
import Loader from "../../components/basics/Loader";

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cursoNombre, setCursoNombre] = useState([]);
  const [cursoDescripcion, setCursoDescripcion] = useState([]);
  const [error, setError] = useState("");

  const value = useContext(AuthContext);

  let navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    turnosService.find().then((turnos) => {
      setTurnos(turnos);
      cursosService
        .find()
        .then((cursos) => {
          setCursos(cursos);
        })
        .catch((err) => setError(err.message));
    });
  }, []);

  function handleDeleteElement(item) {
    turnosService.remove(item._id).then((turnos) => {
      console.log(turnos);
      setTurnos(turnos);
    });
  }

  if (turnos.length > 0) {
    return (
      <main className="container main">
        <div className="cont-admin-turnos">
          <h1>Administrar Turnos</h1>
          <Link to="turno" className="btn btn-primary mt-3">
            Crear un turno
          </Link>
          <ul>
            {cursos.map((curso) => {
              return (
                <>
                <h2>{curso.nombre}</h2>
                <ul>
                  {turnos.filter((turno) => turno.idCurso === curso._id).map((turno) => {
                    // return <p>{turno.horario}</p>
                    return (
                      <li key={turno._id}>
                        <p>
                          Turno: {turno.dia} / Horario: {turno.horario}
                        </p>
                        <Link
                          to={"turno/id-" + turno._id}
                          className="btn btn-warning btn-sm rounded-2 me-2"
                        >
                          Editar turno
                        </Link>
                        <button
                          onClick={() => handleDeleteElement(turno)}
                          className="btn btn-danger btn-sm rounded-2"
                          type="button"
                          data-toggle="tooltip"
                          data-placement="top"
                          title=""
                          data-original-title="Delete"
                        >
                          <i className="fa fa-trash-o" aria-hidden="true"></i>
                          Eliminar turno
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
              );
            })}
          </ul>
        </div>
      </main>
    );
  } else {
    return (
      <main className="container main">
        <Loader></Loader>
      </main>
    );
  }
}
