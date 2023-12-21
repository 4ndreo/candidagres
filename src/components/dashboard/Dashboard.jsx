import "../css/Edit.css";

import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import * as carritoService from "../../services/carrito.service";

import Loader from "../basics/Loader";
import {Col, Container, Nav, Row, Button, Modal, ListGroup } from "react-bootstrap";
import * as cursosService from "../../services/cursos.service";
import * as userService from "../../services/users.service";
import * as turnosService from "../../services/turnos.service";
import * as inscripcionesService from "../../services/inscripciones.service";
import {AuthContext} from "../../App";



export function Dashboard({ title }) {
    let navigate = useNavigate();
    const params = useParams();


    let inscripciones = [];
    let cursos = [];
    let turnos = [];
    let users = [];


    // const [cursos, setCursos] = useState([]);
    // const [users, setUsers] = useState([]);
    // const [turnos, setTurnos] = useState([]);
    // const [inscripciones, setInscripciones] = useState([]);
    const [informacion, setInformacion] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState("");

    const value = useContext(AuthContext);

    const [resultados, setResultados] = useState([]);


    useEffect(() => {

        loadData()

        if (value.currentUser.role !== 1) {
            navigate("/", { replace: true });
        }

    }, []);


    useEffect(() => {

        console.log(informacion)

    }, []);



    function getCursos(){

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

    function getUsers() {
        return new Promise((resolve, reject) => {
            userService.find()
                .then((data) => {
                    users = data;
                    resolve(data);
                })
                .catch((err) => {
                    console.log(err)
                    reject(err);
                });

        })
    }

    function getInscripcionesByUser() {
        return new Promise((resolve, reject) => {
            inscripcionesService.find()
                .then((data) => {
                    inscripciones = data;
                    resolve(data);
                })
                .catch((err) => {
                    console.log(err)
                    reject(err);
                });

        })
    }


    function loadData(){
        return new Promise((resolve, reject) => {
            getCursos().then(() => {
                getTurnos().then(() => {
                    getUsers().then(() => {
                        getInscripcionesByUser()
                            .then(() => {
                                // console.log(turnos, cursos, users, inscripciones)
                                agruparInformacion(cursos, inscripciones, turnos, users)
                                // agruparInformacionTurnos(turnos, inscripciones)
                                resolve();
                            })
                    })
                })
            })
        })
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
            if (!informacionAgrupada[idCurso].turnos[idTurno].users.find((user) => user._id === idUser)) {
                const userInscripto = users.find((user) => user._id === idUser);
                informacionAgrupada[idCurso].turnos[idTurno].users.push(userInscripto);
            }

            // Agrega el usuario a la lista general si no está presente
            if (!informacionAgrupada[idCurso].users.find((user) => user._id === idUser)) {
                const userInscripto = users.find((user) => user._id === idUser);
                informacionAgrupada[idCurso].users.push(userInscripto);
            }
        });

        // return informacionAgrupada;
        setInformacion(informacionAgrupada)
        //return informacionAgrupada;
    }



    // if (productosComprar.length > 0) {

    return (


        <main className="container main">
            <div className="cont-admin-cursos">
                <h1>Dashboard</h1>

                <h2>Información de Usuarios anotados a las Clases</h2>
                {Object.keys(informacion).map((idCurso) => {
                    const { curso, turnos, users } = informacion[idCurso];

                    return (
                        <div key={idCurso}>
                            <h2>{curso.nombre}</h2>

                            {Object.keys(turnos).map((idTurno) => {
                                const { turno, users: usersPorTurno } = turnos[idTurno];

                                return (
                                    <div key={idTurno}>
                                        <p><b>Turno: {turno.nombre}</b></p>

                                        <ul>
                                            {usersPorTurno.map((user) => (
                                                <li key={user._id}>
                                                    <p>Alumno: {user.email}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}

                        </div>
                    );
                })}


            </div>
        </main>


    );

    // }   else
    // {
    //     return (
    //         <main>
    //
    //             <Container fluid>
    //                 <Row>
    //
    //                     <Col md={2} className="d-none d-md-block bg-light sidebar">
    //                         <div className="sidebar-sticky">
    //                             <Nav className="flex-column">
    //                                 <Nav.Link href="/tienda" className="nav-link active">Tienda</Nav.Link>
    //                                 <Nav.Link href={`/carrito/id-${usuarioId}`} className="nav-link">Carrito de Compras</Nav.Link>
    //                                 <Nav.Link href={`/carrito/historial/id-${usuarioId}`} className="nav-link">Historial</Nav.Link>
    //                             </Nav>
    //                         </div>
    //                     </Col>
    //
    //                     <Col md={10} className="ml-md-auto px-md-4">
    //                         <div>
    //                             <h1>Productos seleccionados de {nombre}</h1>
    //                             <p><b>Total:</b> ${total}</p>
    //                         </div>
    //
    //                         <div>
    //                             <p>No tenes productos en el carrito. Hace <a href="/tienda">click aqui</a> para ver los
    //                                 productos disponibles.</p>
    //                         </div>
    //
    //                     </Col>
    //                 </Row>
    //             </Container>
    //
    //         </main>
    //     )
    // }
}
