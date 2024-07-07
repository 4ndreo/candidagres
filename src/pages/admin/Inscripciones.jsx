import "./css/Inscripciones.css";


import { Col, Container, Nav, Row, Button, Modal, ListGroup, Card } from "react-bootstrap";
import React, { useEffect, useState, useContext } from "react";
import {useNavigate, Link, useParams} from "react-router-dom";
import Loader from "../../components/basics/Loader";
import { AuthContext } from "../../App";
import * as cursosService from '../../services/cursos.service';
import * as userService from '../../services/users.service';
import * as turnosService from '../../services/turnos.service';
import * as inscripcionesService from '../../services/inscripciones.service';
import {Swiper, SwiperSlide} from "swiper/react";
import {FreeMode, Pagination} from "swiper";
import * as productosService from "../../services/productos.service";
import * as comprasService from "../../services/compras.service";
import * as carritoService from "../../services/carrito.service";

export default function Inscripciones() {

  let navigate = useNavigate();
  const params = useParams();

  let inscripciones = [];
  let cursos = [];
  let turnos = [];
  let users = [];


  // const [inscripciones, setInscripciones] = useState([]);
  // const [cursos, setCursos] = useState([]);
  // const [turnos, setTurnos] = useState([]);
  // const [users, setInscripciones] = useState([]);


  const [informacion, setInformacion] = useState({});
  const [listadoInscripciones, setListadoInscripciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedTurnoId, setSelectedTurnoId] = useState(null);


  const value = useContext(AuthContext);



  useEffect(() => {
    loadData();

    if (value.currentUser.role !== 1) {
      navigate('/', {replace: true});
    }
  }, []);

  useEffect(() => {
    console.log(informacion);
  }, []);


  function getCursos() {
    return new Promise((resolve, reject) => {
      cursosService
          .find()
          .then((data) => {
            cursos = data;
            resolve(data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
    });
  }


  function getInscripcionesByUser() {
    return new Promise((resolve, reject) => {
      inscripcionesService
          .find()
          .then((data) => {
            inscripciones = data;
            setListadoInscripciones(inscripciones)
            resolve(data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
    });
  }

  function getUsers() {
    return new Promise((resolve, reject) => {
      userService
          .find()
          .then((data) => {
            users = data;
            resolve(data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
    });
  }

  function getTurnos() {
    return new Promise((resolve, reject) => {
      turnosService
          .find()
          .then((data) => {
            turnos = data;
            resolve(data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
    });
  }

  function loadData() {
    return new Promise((resolve, reject) => {
      setLoading(true);
      getCursos().then(() => {
        getTurnos().then(() => {
          getUsers().then(() => {
            getInscripcionesByUser().then(() => {
              // console.log(turnos, cursos, users, inscripciones)
              agruparInformacion(cursos, inscripciones, turnos, users);
              // agruparInformacionTurnos(turnos, inscripciones)
              resolve();
              setLoading(false);
            });
          });
        });
      });
    });
  }


  function agruparInformacion(cursos, inscripciones, turnos, users) {
    const informacionAgrupada = {};

    inscripciones.forEach((inscripcion) => {
      const idCurso = inscripcion.idCurso;
      const idUser = inscripcion.idUser;
      const idTurno = inscripcion.idTurno;

      // Verifica si ya hay información agrupada para este curso
      if (!informacionAgrupada[idCurso]) {
        informacionAgrupada[idCurso] = {
          turnos: {}, // Usamos un objeto para agrupar por idTurno
          curso: null,
          users: [],
        };
      }

      // Agrega el turno si no está presente
      if (!informacionAgrupada[idCurso].turnos[idTurno]) {
        const turnoInscripto = turnos.find((turno) => turno._id === idTurno);
        informacionAgrupada[idCurso].turnos[idTurno] = {
          turno: turnoInscripto,
          users: [],
        };
      }

      // Asigna el curso si no está asignado
      if (!informacionAgrupada[idCurso].curso) {
        const cursoInscripto = cursos.find((curso) => curso._id === idCurso);
        informacionAgrupada[idCurso].curso = cursoInscripto;
      }

      // Agrega el usuario si no está presente en el turno específico
      if (
          !informacionAgrupada[idCurso].turnos[idTurno].users.find(
              (user) => user._id === idUser
          )
      ) {
        const userInscripto = users.find((user) => user._id === idUser);
        informacionAgrupada[idCurso].turnos[idTurno].users.push(userInscripto);
      }

      // Agrega el usuario a la lista general si no está presente
      if (
          !informacionAgrupada[idCurso].users.find((user) => user._id === idUser)
      ) {
        const userInscripto = users.find((user) => user._id === idUser);
        informacionAgrupada[idCurso].users.push(userInscripto);
      }
    });

    // return informacionAgrupada;
    setInformacion(informacionAgrupada);
    //return informacionAgrupada;
  }

  function handleDelete(userId, turnoID){


    setSelectedUserId(userId);
    setSelectedTurnoId(turnoID);
    setShowModal(true);
    //console.log(listadoInscripciones)

  }


  async function handleConfirmar() {

    // Encuentra la inscripción que coincide con userId y turnoID
    const inscripcion = listadoInscripciones.find(
        (ins) => ins.idUser === selectedUserId && ins.idTurno === selectedTurnoId
    );

    console.log('inscripcion: ', inscripcion)
    if (inscripcion) {
      // Realiza la acción deseada, por ejemplo, eliminar la inscripción


      inscripcionesService.remove(inscripcion._id).then(()  => {});

      setShowModal(false);
      loadData();
      //TODO esto esta mal. No deberia ser un LoadData, deberia actualizarse la lista y no tener que recargar la pagina

    } else {
      console.log('No se encontró la inscripción.');
    }


  }


  function handleCancelar() {
    setShowModal(false);
    setShowModal(false);
  }


  if (!loading) {
    return (
        <main className='container main'>
          <div className='cont-admin-cursos'>
            <h1>Inscripciones</h1>

            <p>Información de Usuarios anotados a las Clases</p>
            {Object.keys(informacion).map((idCurso) => {
              const {curso, turnos, users} = informacion[idCurso];

              return (
                  <div key={idCurso} className='cont-curso'>
                    <h2>{curso.nombre}</h2>
                    {Object.keys(turnos).map((idTurno) => {
                      const {turno, users: usersPorTurno} = turnos[idTurno];

                      return (
                          <div key={idTurno} className='cont-turno mb-2'>
                            <h3>{turno.nombre}</h3>
                            <ul className='alumnos-lista list-group'>
                              {usersPorTurno.map((user) => (
                                  <li key={user._id} className='alumno-item  mb-2'>
                                    <p>{user.email}</p>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => { handleDelete(user._id, idTurno); }}
                                    > X
                                    </button>
                                  </li>
                              ))}
                            </ul>

                            <Modal show={showModal} onHide={handleCancelar}>
                              <Modal.Header closeButton>
                                <Modal.Title className="p-2">Eliminar Inscripción</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <p>¿Estás seguro de eliminar esta inscripción? No se puede revertir.</p>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button variant="secondary" onClick={handleCancelar}>
                                  Cancelar
                                </Button>
                                <Button variant="primary" onClick={handleConfirmar}>
                                  Confirmar
                                </Button>
                              </Modal.Footer>
                            </Modal>




                          </div>
                      );
                    })}
                  </div>

              );
            })}
          </div>
        </main>
    );
  } else {
    return (
        <main className='container'>
          <Loader></Loader>
        </main>
    );
  }
}
