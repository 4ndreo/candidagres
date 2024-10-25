import "./Shifts.css";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import * as turnosService from "../../services/shifts.service";
import * as classesService from "../../services/classes.service";
// import * as shiftsService from "../../services/shifts.service";
import * as inscripcionesService from "../../services/enrollments.service";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useContext } from "react";
import { AuthContext } from "../../App";
import LoaderMini from "../../components/basics/LoaderMini";
import Loader from "../../components/basics/Loader";
import TarjetaTurno from "../../components/tarjeta-turno/TarjetaTurno";
import { useQuery } from "react-query";

export function ShiftsPage() {
  let navigate = useNavigate();
  const value = useContext(AuthContext);
  const params = useParams();

  const fetchShifts = async () => {
    const result = await classesService.findOneWithShifts(params.id);
    return result;
  }

  const { data: classData, isLoading, isError, error, refetch } = useQuery(
    'classData',
    fetchShifts,
    {
      staleTime: 60000,
      retry: 2,
    }
  );

  const [turnos, setTurnos] = useState([]);
  const [curso, setCurso] = useState();
  const [inscripciones, setInscripciones] = useState([]);
  // const [error, setError] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState({});
  const [hoveredTurno, setHoveredTurno] = useState("");
  const [selectedInscripcion, setSelectedInscripcion] = useState({});
  const [cupos, setCupos] = useState([]);
  const [loadingInscripciones, setLoadingInscripciones] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


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
  
  // useEffect(() => {
  //   getTurnos(params?.id)
  //     .then(() => {
  //       getInscripcionesByUser(value.currentUser._id)
  //         .then(() => {
  //           getCurso().then(() => {
  //             inscripcionesService.countInscripcionesByCurso(params?.id).then((data) => {
  //               setCupos(data);
  //               setLoadingInscripciones(false);
  //             })
  //           });
  //         })
  //     }).catch((err) => {
  //       console.log(err)
  //     })
  //     ;

  // }, []);

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
          // setError(err.message);
          reject(err);
        });

    })
  }

  function getCurso(curso_id) {
    return new Promise((resolve, reject) => {
      classesService
        .findById(params?.id || curso_id)
        .then((curso) => {
          setCurso(curso);
          resolve();
        })
        .catch((err) => {
          // setError(err.message);
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
          // setError(err.message);
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
              inscripcionesService.countInscripcionesByCurso(params?.id).then((data) => {
                setCupos(data);
                setLoadingInscripciones(false);
              })
            });

          })
        }
        if (inscripciones[0].deleted) {
          return restoreInscripciones(inscripciones[0]._id).then(() => {
            getInscripcionesByUser(value.currentUser._id).then(() => {
              inscripcionesService.countInscripcionesByCurso(params?.id).then((data) => {
                setCupos(data);
                setLoadingInscripciones(false);
              })
            });

          })
        } else {
          return inscripcionesService.remove(inscripciones[0]._id)
            .then(() => {
              getInscripcionesByUser(value.currentUser._id).then(() => {
                inscripcionesService.countInscripcionesByCurso(params?.id).then((data) => {
                  setCupos(data);
                  setLoadingInscripciones(false);
                })
              });
              // setInscripciones(inscripciones);
            })
            // .catch((err) => setError(err.message));
        }
      })
      // .catch((err) => setError(err.message));
  }

  function createInscripcion(data) {
    return new Promise((resolve, reject) => {
      inscripcionesService.create({ id: data.id, idTurno: data._id, idUser: value.currentUser._id })
        .then((data) => {
          resolve();
        })
        .catch((err) => {
          // setError(err.message);
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
          // setError(err.message);
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
  // return     (
  //   <main>

  //  { JSON.stringify(classData?.shifts.length)}
  //   </main>
  //   )
  

  // TODO: cambiar por Swiper para mostrar dias de la semana. Esto va a hacer que la funcionalidad sea responsive
  if (classData && classData?.shifts.length > 0) {

    return (

      <main className="container main">
        <div className="cont-turno">
          <h1>Horarios disponibles para "{classData.title}"</h1>
          <ul className="cont-listado-dias">
            {diasSemana.map((diaSemana) => {
              return (
                <li key={diaSemana.id} className="item-dia">
                  <h2> {diaSemana.nombre}</h2>
                  <ul className="cont-TarjetaTurnos">
                    {classData.shifts.map((shift) => {
                      if (shift.days.some((day) => day === diaSemana.id)) {
                        return (
                          <TarjetaTurno
                            key={shift._id}
                            shift={shift}
                            classData={classData}
                            weekdays={diasSemana}
                            handleSelectedTurno={handleSelectedTurno}
                            handleSelectedInscripcion={handleSelectedInscripcion}
                            handleMouseOver={handleMouseOver}
                            handleMouseLeave={handleMouseLeave}
                            hoveredTurno={hoveredTurno}
                            handleShow={handleShow}
                            verifyInscripto={verifyInscripto}
                            inscripcion={inscripciones.filter(inscripcion => inscripcion.idUser === value.currentUser._id && inscripcion.idTurno === shift._id)}
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
