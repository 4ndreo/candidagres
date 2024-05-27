import "./VerTurnos.css";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import * as turnosService from "../../services/turnos.service";
import * as cursosService from "../../services/cursos.service";
import * as inscripcionesService from "../../services/inscripciones.service";
import Loader from "../basics/Loader";
import TarjetaTurno from "../tarjeta-turno/TarjetaTurno";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useContext } from "react";
import { AuthContext } from "../../App";
import LoaderMini from "../basics/LoaderMini";

export function VerTurnos() {
  let navigate = useNavigate();
  const value = useContext(AuthContext);
  const params = useParams();

  const [turnos, setTurnos] = useState([]);
  const [curso, setCurso] = useState();
  const [inscripciones, setInscripciones] = useState([]);
  const [error, setError] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState({});
  const [hoveredTurno, setHoveredTurno] = useState("");
  const [selectedInscripcion, setSelectedInscripcion] = useState({});
  const [cupos, setCupos] = useState([]);
  const [loadingInscripciones, setLoadingInscripciones] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let daysCount = 0;

  const diasSemana = [
    {
      id: "D1",
      nombre: "Lunes",
    },
    {
      id: "D2",
      nombre: "Martes",
    },
    {
      id: "D3",
      nombre: "Miércoles",
    },
    {
      id: "D4",
      nombre: "Jueves",
    },
    {
      id: "D5",
      nombre: "Viernes",
    },
  ];
  useEffect(() => {
    getTurnos(params?.idCurso)
      .then(() => {
        getInscripcionesByUser(value.currentUser._id)
          .then(() => {
            getCurso().then(() => {
              inscripcionesService.countInscripcionesByCurso(params?.idCurso).then((data) => {
                setCupos(data);
                setLoadingInscripciones(false);
              })
            });
          })
      }).catch((err) => {
        console.log(err)
      })
      ;

  }, []);

  function getTurnos(curso_id) {
    return new Promise((resolve, reject) => {
      turnosService.findByCurso(curso_id)
        .then((data) => {
          setTurnos(
            data?.sort(function (a, b) {
              return a.horarioInicio - b.horarioInicio;
            })
          )
          resolve();
        })
        .catch((err) => {
          console.log(err)
          setError(err.message);
          reject(err);
        });

    })
  }

  function getCurso(curso_id) {
    return new Promise((resolve, reject) => {
      cursosService
        .findById(params?.idCurso || curso_id)
        .then((curso) => {
          setCurso(curso);
          resolve();
        })
        .catch((err) => {
          setError(err.message);
          reject(err);
        });
    })
  }

  function getInscripcionesByUser(user_id) {
    return new Promise((resolve, reject) => {
      inscripcionesService
        .findByUser(user_id)
        .then((inscripciones) => {
          setInscripciones(inscripciones);
          resolve();
        })
        .catch((err) => {
          setError(err.message);
          reject(err);
        });
    })
  }
  function handleInscripciones(turno) {
    setLoadingInscripciones(true);
    inscripcionesService.findAllByUserAndTurno(value.currentUser._id, turno._id)
      .then((inscripciones) => {
        if (inscripciones.length === 0) {
          return createInscripcion(turno).then(() => {
            getInscripcionesByUser(value.currentUser._id).then(() => {
              inscripcionesService.countInscripcionesByCurso(params?.idCurso).then((data) => {
                setCupos(data);
                setLoadingInscripciones(false);
              })
            });

          })
        }
        if (inscripciones[0].deleted) {
          return restoreInscripciones(inscripciones[0]._id).then(() => {
            getInscripcionesByUser(value.currentUser._id).then(() => {
              inscripcionesService.countInscripcionesByCurso(params?.idCurso).then((data) => {
                setCupos(data);
                setLoadingInscripciones(false);
              })
            });

          })
        } else {
          return inscripcionesService.remove(inscripciones[0]._id)
            .then(() => {
              getInscripcionesByUser(value.currentUser._id).then(() => {
                inscripcionesService.countInscripcionesByCurso(params?.idCurso).then((data) => {
                  setCupos(data);
                  setLoadingInscripciones(false);
                })
              });
              // setInscripciones(inscripciones);
            })
            .catch((err) => setError(err.message));
        }
      })
      .catch((err) => setError(err.message));
  }

  function createInscripcion(data) {
    return new Promise((resolve, reject) => {
      inscripcionesService.create({ idCurso: data.idCurso, idTurno: data._id, idUser: value.currentUser._id })
        .then((data) => {
          resolve();
        })
        .catch((err) => {
          setError(err.message);
          reject(err);
        });
    })
  }

  function restoreInscripciones(inscripcionId) {
    return new Promise((resolve, reject) => {
      inscripcionesService.update(inscripcionId, { deleted: false })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          setError(err.message);
          reject(err);
        });
    })
  }

  function handleSelectedTurno(turno) {
    setSelectedTurno(turno);
  }

  function handleSelectedInscripcion(inscripcion) {
    if (inscripcion.length > 0) {
      setSelectedInscripcion(inscripcion[0]._id);
    }
  }

  function handleMouseOver(id) {
    setHoveredTurno(id);
  }

  function handleMouseLeave() {
    setHoveredTurno('');
  }

  function verifyInscripto(turno_id) {
    return inscripciones.map(inscripcion =>
      Object.values(inscripcion).some((arrVal) => turno_id === arrVal)
    )
  }

  if (curso && turnos.length > 0) {
    return (
      <main className="container main">
        <div className="cont-turno">
          <h1>Turnos disponibles para la clase "{curso.nombre}"</h1>
          <ul className="cont-listado-dias">
            {diasSemana.map((diaSemana) => {
              return (
                <li key={diaSemana.id} className="item-dia">
                  <h2> {diaSemana.nombre}</h2>
                  <ul className="cont-TarjetaTurnos">
                    {turnos.map((turno) => {
                      if (turno.dias.some((dia) => dia === diaSemana.id)) {
                        return (
                          <TarjetaTurno
                            key={turno._id}
                            turno={turno}
                            handleSelectedTurno={handleSelectedTurno}
                            handleSelectedInscripcion={handleSelectedInscripcion}
                            handleMouseOver={handleMouseOver}
                            handleMouseLeave={handleMouseLeave}
                            hoveredTurno={hoveredTurno}
                            handleShow={handleShow}
                            verifyInscripto={verifyInscripto}
                            inscripcion={inscripciones.filter(inscripcion => inscripcion.idUser === value.currentUser._id && inscripcion.idTurno === turno._id)}
                            cupos={cupos}
                          />
                        );
                      }
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>

          <Modal show={show} onHide={handleClose} size="lg" variant="white">
            <Modal.Header className="modal-title" closeButton>
              <Modal.Title className="negritas">Inscribirse al curso de {curso.nombre}</Modal.Title>
              <button type="button" className="btn btn-link btn-close-link" variant="link" onClick={handleClose}></button>
            </Modal.Header>
            <Modal.Body>
              <p><span className="negritas">Detalle de la clase:</span> {curso.descripcion}</p>
              <p>
                <span className="negritas">Dias y horario:</span>
                {selectedTurno.dias?.map(dia => {

                  daysCount++
                  return (
                    <span key={dia}>{daysCount > 1 ? ', ' : ''} {diasSemana.find(o => o.id === dia).nombre}</span>

                  )
                })}
                <span> de {selectedTurno.horarioInicio}hs a {selectedTurno.horarioFin}hs</span>
              </p>
              <p><span className="negritas">Docente:</span> {curso.profesor.charAt(0).toUpperCase() + curso.profesor.slice(1)}</p>
              <p><span className="negritas">Precio:</span> ${curso.precio}</p>
            </Modal.Body>
            <Modal.Footer>

              {verifyInscripto(selectedTurno._id).some(val => val) ?
                <button
                  type="button"
                  disabled={loadingInscripciones}
                  className={loadingInscripciones ? "btn-close-link btn-loading" : "btn-close-link btn-inscripto"}
                  onClick={() => handleInscripciones(selectedTurno)}>
                  {loadingInscripciones ? <LoaderMini></LoaderMini> : ""}
                </button>
                :
                ((cupos.filter(cupo => cupo._id === selectedTurno._id)[0]?.totalQuantity ?? 0) === selectedTurno.max_turnos) ?
                  <button
                    type="button"
                    className="btn btn-link btn-close-link btn-full"
                    disabled>
                  </button>
                  :
                  <button
                    type="button"
                    disabled={loadingInscripciones}
                    className={loadingInscripciones ? "btn-loading" : "btn btn-primary btn-agregar"}
                    onClick={() => handleInscripciones(selectedTurno)}>
                    <span>
                      {loadingInscripciones ? <LoaderMini></LoaderMini> : "Inscribirse en este horario"}
                    </span>
                  </button>
              }
            </Modal.Footer>
          </Modal>
        </div>
      </main>
    );
  } else {
    return (
      <main className="container">
        <Loader></Loader>
      </main>
    );
  }
}
