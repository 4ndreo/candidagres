import "./css/Turnos.css";

import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as inscripcionesService from "../services/enrollments.service";
import * as classesService from "../services/classes.service";
import * as turnosService from "../services/shifts.service";
import { AuthContext } from "../App";
import Loader from "../components/basics/Loader";

export default function MisClases() {
  // let inscripciones = [];
  let cursos = [];
  let turnos = [];
  const [groupedInscripciones, setGroupedInscripciones] = useState([]);

  const [nombre, setNombre] = useState("");
  const [inscripciones, setInscripciones] = useState([]);
  const [idUser, setIdUser] = useState("");
  const [inscripcionesUsuario, setInscripcionesUsuario] = useState([]);
  const [loading, setLoading] = useState(true);

  const value = useContext(AuthContext);

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
    value.setCurrentUser(JSON.parse(localStorage.getItem("user")));

    loadData();

  }, []);

  useEffect(() => {
    // let groupedInscripciones = inscripciones.reduce((insc, { nombre_curso, ...inscripciones }) => {
    //   if (!insc[nombre_curso]) insc[nombre_curso] = [];
    //   insc[nombre_curso].push(inscripciones);
    //   return insc;
    // }, {});
    let groupedInscripciones = Object.groupBy(inscripciones, ({ nombre_curso }) => nombre_curso);

    setGroupedInscripciones(groupedInscripciones);
    Object.entries(groupedInscripciones).forEach(([key, value]) => {

      console.log('key', key, value)
    })

  }, [inscripciones])

  useEffect(() => {

  }, [groupedInscripciones])

  function getInscripcionesByUser() {
    return new Promise((resolve, reject) => {
      inscripcionesService.findByUser(value.currentUser._id)
        .then((data) => {
          setLoading(false);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });

    })
  }

  function getCursos() {
    return new Promise((resolve, reject) => {
      classesService.find()
        .then((data) => {
          cursos = data;
          resolve(data);
        })
        .catch((err) => {
          console.log(err)
          reject(err);
        });

    })
  }

  function getTurnos() {
    return new Promise((resolve, reject) => {
      turnosService.find()
        .then((data) => {
          turnos = data;
          resolve(data);
        })
        .catch((err) => {
          console.log(err)
          reject(err);
        });

    })
  }
  const loadData = () => {
    return new Promise((resolve, reject) => {
      getCursos().then(() => {
        getTurnos().then(() => {
          getInscripcionesByUser()
            .then((data) => {
              let inscripcionesArr = data;
              console.log('inscripcionesArr', inscripcionesArr)
              inscripcionesArr.forEach(async (inscripcion, index) => {
                let curso = cursos.find(curso => curso._id === inscripcion.idCurso)
                inscripcionesArr[index] = { ...inscripcionesArr[index], ...curso, _idCurso: curso._id, _id: inscripcion._id, nombre_curso: curso.nombre };

                let turno = turnos.find(turno => turno._id === inscripcion.idTurno)
                inscripcionesArr[index] = { ...inscripcionesArr[index], ...turno, _idTurno: turno._id, _id: inscripcion._id, nombre_turno: turno.nombre };

              })
              setInscripciones(inscripcionesArr);
              resolve();
            })
        })
      })
    })
  }
  function handleDeleteElement(id) {
    if (window.confirm("¿Estas seguro que queres eliminar tu inscripción?")) {
      inscripcionesService.remove(id).then((inscripcion) => {
        setLoading(true);
        loadData();
        // navigate("/perfil", { replace: true });
      });
    }

    //console.log(id)
  }

  if ((value.currentUser.email.length === 0 && loading) || value.currentUser.email.length > 0) {
    return (
      <main className="container main">
        <div className="cont-perfil">
          <h1>Mi Perfil - {value.currentUser.email}</h1>
          <h2>Clases anotadas</h2>

          {loading ? (
            <Loader className="w-50"></Loader>
          ) : (
            <>
              {inscripciones.length === 0 ? (
                <p>Aún no estás inscripto a ningún curso.</p>
              ) : (
                <ul className="col-6">
                  {Object.entries(groupedInscripciones).map(([key, value]) => {
                    return (
                      // <p>aaa</p>
                      <li key={key}>
                        {/* <p>aaaa</p> */}
                        <div className="card-body">
                          <h3 className="card-title h5">
                            {key}
                          </h3>
                          <p className="card-text">
                            {value[0].descripcion}
                          </p>
                          <p className="card-text">
                            <span className="negritas">Precio:</span> ${value[0].precio}
                          </p>
                          <p className="card-text">
                            <span className="negritas">Docente:</span> {value[0].profesor}
                          </p>
                          <p className="card-text">
                            <span className="negritas">Edad:</span> {value[0].edad}
                          </p>
                          {
                            value.map((element, index) => {
                              return (
                                <div key={element._id} className="days d-flex gap-4 align-items-center mb-2">
                                  <span>{
                                    element.dias?.map(dia => {
                                      return (
                                        <span key={dia}>{diasSemana.find(o => o.id === dia).nombre}{element.dias.length > 1 ? ', ' : ''}</span>
                                      )
                                    })
                                  } {element.horarioInicio} - {element.horarioFin}</span>
                                  <button
                                    onClick={() => handleDeleteElement(element._id)}
                                    className="btn btn-danger btn-icon"
                                    type="button"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title=""
                                    data-original-title="Delete"
                                  ><span className="pi pi-trash"></span>Desinscribirse
                                  </button>
                                </div>
                              )
                            })
                          }
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </div>
      </main>
    );
  } else {
    return (
      <main className="container main">
        <p>Ocurrió un error</p>
      </main>
    );
  }
}
