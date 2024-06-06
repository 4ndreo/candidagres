import "./css/Perfil.css";

import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as inscripcionesService from "../services/inscripciones.service";
import * as cursosService from "../services/cursos.service";
import * as turnosService from "../services/turnos.service";
import { AuthContext } from "../App";
import Loader from "../components/basics/Loader";

import UserImg from "../img/user.svg";

export default function Turnos() {
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

  let navigate = useNavigate();

  useEffect(() => {
    value.setCurrentUser(JSON.parse(localStorage.getItem("user")));
    if (!value.token) {
      navigate("/login", { replace: true });
    }

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
      cursosService.find()
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
        <div class="grid">
          <div class="col-6 m-auto">
            <div class="card">
              <div class=" user-card">
                <img imageClass="avatar-img" src={UserImg}
                  alt="Imagen de perfil del usuario" width="150" />
                <div class="user-info">
                  <h1>{value.currentUser.name}</h1>
                  <p>{value.currentUser.email}</p>
                </div>
              </div>
              <button class="edit-btn p-ripple" ></button>
            </div>
          </div>
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
