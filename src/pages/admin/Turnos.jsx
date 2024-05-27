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
          console.log(cursos)
          setCursos(cursos);
        })
        .catch((err) => setError(err.message));
    });
  }, []);

  function handleDeleteElement(item) {

    if (window.confirm("¿Esta seguro que quiere eliminar el turno?")) {
      turnosService.remove(item._id).then((turnos) => {
        console.log(turnos);
        setTurnos(turnos);
      });
    }

  }

  function handleDia(dias) {

    const diasMapping = {
      D1: 'Lunes',
      D2: 'Martes',
      D3: 'Miércoles',
      D4: 'Jueves',
      D5: 'Viernes',
      // Puedes agregar más abreviaturas y nombres según sea necesario
    };

    const nombresDias = dias.map(abreviatura => diasMapping[abreviatura]);

    return nombresDias
    console.log(nombresDias);
    //console.log(dias)


  }

  if (turnos.length > 0) {
    return (
      <main className="container main">
        <div className="cont-admin-turnos">
          <h1>Administrar Turnos</h1>
          <Link to="turno" className="btn btn-primary btn-agregar mt-3">
            <span>Crear un turno</span>
          </Link>
          <ul>
            {cursos.map((curso) => {
              return (
                <div key={curso._id}>
                  <h2>{curso.nombre}</h2>
                  <ul>
                    {turnos
                      .filter((turno) => turno.idCurso === curso._id)
                      .map((turno) => (
                        <li className="card mb-3" key={turno._id}>
                          <div className="row g-0">
                            <div className="card-body col-md-8">
                              <small className="text-body-secondary">Cupo maximo: {turno.max_turnos} personas</small>
                              <h5 className="card-title">{turno.nombre}</h5>
                              <p className="card-text">Dias: {handleDia(turno.dias).join(', ')}</p>
                              <p className="card-text">Horario: De {turno.horarioInicio}hs a {turno.horarioFin}hs</p>
                            </div>
                            <div className="col-md-4 d-flex align-items-end justify-content-end">
                              <Link
                                to={"turno/id-" + turno._id}
                                className="btn btn-warning btn-editar me-2"
                              >
                                <span>Editar turno</span>
                              </Link>
                              <button
                                onClick={() => handleDeleteElement(turno)}
                                className="btn btn-danger btn-eliminar"
                                type="button"
                                data-toggle="tooltip"
                                data-placement="top"
                                title=""
                                data-original-title="Delete"
                              >
                                <span>Eliminar turno</span>
                              </button>
                            </div>
                          </div>
                        </li>
                        // <li key={turno._id}>
                        //   <p>Nombre del turno: {turno.nombre}</p>
                        //   <p>Dias: {handleDia(turno.dias).join(', ')}</p>
                        //   <p>Horario: De {turno.horarioInicio}hs a {turno.horarioFin}hs</p>
                        //   <p>Cupo maximo: {turno.max_turnos} personas</p>
                        //   <Link
                        //       to={"turno/id-" + turno._id}
                        //       className="btn btn-warning btn-editar me-2"
                        //   >
                        //     <span>Editar turno</span>
                        //   </Link>
                        //   <button
                        //       onClick={() => handleDeleteElement(turno)}
                        //       className="btn btn-danger btn-eliminar"
                        //       type="button"
                        //       data-toggle="tooltip"
                        //       data-placement="top"
                        //       title=""
                        //       data-original-title="Delete"
                        //   >
                        //     <span>Eliminar turno</span>
                        //   </button>
                        // </li>
                      ))}
                    {turnos.filter((turno) => turno.idCurso === curso._id).length === 0 && (
                      <li>No tiene un turno asignado.</li>
                    )}
                  </ul>
                </div>
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
