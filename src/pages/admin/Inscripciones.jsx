import "./css/Inscripciones.css";


import { Col, Container, Nav, Row, Button, Modal, ListGroup, Card } from "react-bootstrap";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import Loader from "../../components/basics/Loader";
import { AuthContext } from "../../App";
import * as classesService from '../../services/classes.service';
import * as userService from '../../services/users.service';
import * as turnosService from '../../services/turnos.service';
import * as inscripcionesService from '../../services/inscripciones.service';
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal/ConfirmDeleteModal";

export default function Inscripciones() {

  let navigate = useNavigate();
  const params = useParams();

  // let inscripciones = [];
  // let cursos = [];
  // let turnos = [];
  // let users = [];


  const [inscripciones, setInscripciones] = useState(null);
  const [cursos, setCursos] = useState(null);
  const [turnos, setTurnos] = useState(null);
  const [users, setUsers] = useState(null);
  const [refresh, setRefresh] = useState(false);


  const [informacion, setInformacion] = useState({});
  // const [listadoInscripciones, setListadoInscripciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTurno, setSelectedTurno] = useState(null);


  const value = useContext(AuthContext);



  useEffect(() => {
    loadData();

    if (value.currentUser.role !== 1) {
      navigate('/', { replace: true });
    }
  }, []);

  useEffect(() => {
    agruparInformacion(cursos, inscripciones, turnos, users);
  }, [refresh]);

  useEffect(() => {
    setMessage(null);
  }, [message]);


  async function getCursos() {
    return new Promise((resolve, reject) => {
      classesService
        .find()
        .then((data) => {
          setCursos(data);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async function getInscripcionesByUser() {
    return new Promise((resolve, reject) => {
      inscripcionesService
        .find()
        .then((data) => {
          setInscripciones(data)
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async function getUsers() {
    return new Promise((resolve, reject) => {
      userService
        .find()
        .then((data) => {
          setUsers(data);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async function getTurnos() {
    return new Promise((resolve, reject) => {
      turnosService
        .find()
        .then((data) => {
          setTurnos(data);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async function loadData() {
    // return new Promise(async (resolve, reject) => {
      try {
        
        setLoading(true);
        await getCursos()
        await getTurnos()
        await getUsers()
        await getInscripcionesByUser()
        setRefresh(!refresh)
      } catch (error) {
        console.log('error catch', error)
      }
      // console.log(turnos, cursos, users, inscripciones)
      // // agruparInformacionTurnos(turnos, inscripciones)
      // resolve(
      //   setRefresh(!refresh)
      // );
      setLoading(false);
    // });
  }


  function agruparInformacion(cursos, inscripciones, turnos, users) {
    try {


      const informacionAgrupada = {};

      inscripciones?.forEach((inscripcion) => {
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
          const turnoInscripto = turnos?.find((turno) => turno._id === idTurno);
          informacionAgrupada[idCurso].turnos[idTurno] = {
            turno: turnoInscripto,
            users: [],
          };
        }

        // Asigna el curso si no está asignado
        if (!informacionAgrupada[idCurso].curso) {
          const cursoInscripto = cursos?.find((curso) => curso._id === idCurso);
          informacionAgrupada[idCurso].curso = cursoInscripto;
        }

        // Agrega el usuario si no está presente en el turno específico
        if (
          !informacionAgrupada[idCurso].turnos[idTurno].users.find(
            (user) => user._id === idUser
          )
        ) {
          const userInscripto = users?.find((user) => user._id === idUser);
          informacionAgrupada[idCurso].turnos[idTurno].users.push(userInscripto);
        }

        // Agrega el usuario a la lista general si no está presente
        if (
          !informacionAgrupada[idCurso].users.find((user) => user._id === idUser)
        ) {
          const userInscripto = users?.find((user) => user._id === idUser);
          informacionAgrupada[idCurso].users.push(userInscripto);
        }
      });
      setInformacion(informacionAgrupada);
    } catch (error) {
      console.log('error', error);
      setMessage({ ...message, status: 'danger', message: 'Error al traer la información.' });
    }
  }

  function handleDelete(userId, turnoID) {
    setSelectedUser(userId);
    setSelectedTurno(turnoID);
    setShowModal(true);
  }


  async function handleConfirmar() {

    // Encuentra la inscripción que coincide con userId y turnoID
    const inscripcion = inscripciones.find(
      (ins) => ins.idUser === selectedUser._id && ins.idTurno === selectedTurno._id
    );

    if (inscripcion) {
      // Realiza la acción deseada, por ejemplo, eliminar la inscripción
      inscripcionesService.remove(inscripcion._id).then(() => {
        setMessage({ status: 'success', message: 'Inscripción eliminada correctamente.' });
        setShowModal(false);
        loadData();
      });
    } else {
      console.log('No se encontró la inscripción.');
    }


  }


  function handleCancelar() {
    setShowModal(false);
  }


  if (!loading) {
    return (
      <main className='container main'>
        {message && (
          <div className={"alert alert-" + message.status} role="alert">
            {message.message}
          </div>
        )}
        <div className='cont-admin-cursos'>
          <h1>Inscripciones</h1>

          <p>Información de Usuarios anotados a las Clases</p>
          {Object.keys(informacion).map((idCurso) => {
            const { curso, turnos, users } = informacion[idCurso];

            return (
              <div key={idCurso} className='cont-inscripcion-curso'>
                <h2>{curso.nombre}</h2>
                <div className='d-flex gap-5'>


                  {Object.keys(turnos).map((idTurno) => {
                    const { turno, users: usersPorTurno } = turnos[idTurno];

                    return (
                      <div key={idTurno} className='cont-turno mb-2 col-2'>
                        <h3>{turno.nombre}</h3>
                        <ul className='alumnos-lista list-group'>
                          {usersPorTurno.map((user) => (
                            <>
                              <li key={user._id} className='alumno-item  mb-2 d-flex  gap-4'>
                                <p>{user.email}</p>

                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() => { handleDelete(user, turno); }}
                                > <span className="pi pi-trash"></span>
                                </button>
                              </li>
                            </>
                          ))}
                        </ul>
                        <ConfirmDeleteModal show={showModal} onHide={handleCancelar} handleClose={handleCancelar} handleConfirmDelete={handleConfirmar} title="Eliminar Inscripción" message={'¿Estás seguro de eliminar a "' + selectedUser?.email + '" del Turno "' + selectedTurno?.nombre + '" esta inscripción? No se puede revertir.'} cancelButton="Cancelar" confirmButton="Eliminar definitivamente"></ConfirmDeleteModal>
                      </div>
                    );
                  })}
                </div>
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
