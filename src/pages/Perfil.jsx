import "./css/Turnos.css";

import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as inscripcionesService from "../services/inscripciones.service";
import * as cursosService from "../services/cursos.service";
import * as turnosService from "../services/turnos.service";
import { AuthContext } from "../App";
import Loader from "../components/basics/Loader";

export default function Turnos() {
  let inscripciones = [];

  const [nombre, setNombre] = useState("");
  const [idUser, setIdUser] = useState("");
  const [cursos, setCursos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [inscripcionesUsuario, setInscripcionesUsuario] = useState([]);
  const [loading, setLoading] = useState(true);

  const value = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    value.setCurrentUser(JSON.parse(localStorage.getItem("user")));
    if (!value.token) {
      navigate("/login", { replace: true });
    }
    getInscripcionesByUser()
    .then(() => {
      inscripciones.forEach((inscripcion, index) => {
        getCursosById(inscripcion.idCurso)
        .then(curso => {
          inscripciones[index] = {...inscripciones[index], ...curso};
        })
      });
      
    })
    .then(() => {
      inscripciones.forEach((inscripcion, index) => {
        getTurnosById(inscripcion.idTurno)
        .then(turno => {
          inscripciones[index] = {...inscripciones[index], ...turno};
        })
      })
    })
    .finally(() => {
      setLoading(false);
      console.log('inscripciones', inscripciones)
      
    })
    ;
    // turnosService.find()
    //     .then((turnos) =>{
    //         setTurnos(turnos)
    //     })
  }, []);

  function getInscripcionesByUser() {
    return new Promise((resolve, reject) => {
      inscripcionesService.findByUser(value.currentUser._id)
      .then((data) => {
        inscripciones = data;
      })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
      
    })
  }

  async function getCursosById(cursoId) {
    return new Promise((resolve, reject) => {
      cursosService.findById(cursoId)
      .then((data) => {
        resolve(data); 
      })
      .catch((err) => {
        console.log(err)
        reject(err);
      });
      
    })
  }

  async function getTurnosById(turnoId) {
    return new Promise((resolve, reject) => {
      turnosService.findById(turnoId)
      .then((data) => {
        resolve(data); 
      })
      .catch((err) => {
        console.log(err)
        reject(err);
      });
      
    })
  }

  const fn = async () => {
    const delay = (timeout, promise) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(promise()), timeout);
      });
    };

    const [cursos, inscripciones] = await Promise.all([
      delay(200, cursosService.find),
      inscripcionesService.find(),
    ]);

    console.log(cursos, inscripciones);
    const user = JSON.parse(window.localStorage.getItem("user"));
    setNombre(user.email);
    setIdUser(user._id);

    let inscripcionesDelUsuario = inscripciones
      .filter((inscripcion) => inscripcion.idUser === user._id)
      .map((inscripcion) => ({
        ...inscripcion,
        curso: cursos.find((curso) => curso._id === inscripcion.idCurso),
      }));

      console.log('inscripcionesDelUsuario', inscripcionesDelUsuario);
    setInscripcionesUsuario(inscripcionesDelUsuario);
    setLoading(false);
    // inscripcionesDelUsuario = inscripciones.filter(inscripcion => inscripcion.idUser === user._id)
    //     .map(inscripcion => ({
    //         ...inscripcion,
    //         turno: turnos.find(turno => turno._id === inscripcion.idCurso)
    //     }))
    //
    // setInscripcionesUsuario(inscripcionesDelUsuario)

    //console.log(inscripcionesDelUsuario)
    //console.log(JSON.stringify(inscripcionesUsuario))
  };

  useEffect(() => {
    // fn();
  }, []);

  function handleDeleteElement(id) {
    window.confirm("¿Estas seguro que queres eliminar tu inscripción?");
    inscripcionesService.remove(id).then((inscripcion) => {
      setLoading(true);
      fn();
      navigate("/perfil", { replace: true });
    });
    //console.log(id)
  }

  if ((value.currentUser.email.length === 0 && loading) || value.currentUser.email.length > 0) {
    return (
      <main className="container main">
        <div className="cont-perfil">
          <h1>Mi Perfil - {nombre}</h1>
          <h2>Clases anotadas</h2>

          {loading ? (
            <Loader className="w-50"></Loader>
          ) : (
            <>
              {inscripcionesUsuario.length === 0 ? (
                <p>Aún no estás inscripto a ningún curso.</p>
              ) : (
                <ul className="col-6">
                  {inscripcionesUsuario.map((inscripcion) => {
                    return (
                      <li key={inscripcion._id}>
                        <div className="card-body">
                          <h5 className="card-title">
                            {inscripcion.curso.nombre}
                          </h5>
                          <p className="card-text">
                            {inscripcion.curso.descripcion}
                          </p>
                          <p className="card-text">
                            Duración: {inscripcion.curso.duracion}Hrs
                          </p>
                          {/* <a
                            href={`perfil/turno/id-${inscripcion.idTurno}/inscripcion/id-${inscripcion._id}`}
                            className="btn btn-primary me-2"
                          >
                            Ver Turno
                          </a> */}
                          <button
                            onClick={() => handleDeleteElement(inscripcion._id)}
                            className="btn btn-danger"
                            type="button"
                            data-toggle="tooltip"
                            data-placement="top"
                            title=""
                            data-original-title="Delete"
                          >
                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                            Eliminar Inscripción
                          </button>
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
