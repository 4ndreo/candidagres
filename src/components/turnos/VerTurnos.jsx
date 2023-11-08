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

export function VerTurnos() {
  let navigate = useNavigate();
  const value = useContext(AuthContext);

  const [turnos, setTurnos] = useState([]);
  const [curso, setCurso] = useState();
  const [inscripciones, setInscripciones] = useState([]);
  const [error, setError] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState({});
  const [hoveredTurno, setHoveredTurno] = useState("");

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
  const params = useParams();

  useEffect(() => {
      getTurnos();
      getInscripcionesByUser(value.currentUser._id);
  }, []);
  
  function getTurnos(curso_id) {
    turnosService.find()
    .then((data) => {
      setTurnos(
        data?.sort(function (a, b) {
          return a.horarioInicio - b.horarioInicio;
        })
        )
        getCurso();
        
    })
    .catch((err) => setError(err.message));
  }

  function getCurso(curso_id) {
    cursosService
    .findById(params?.idCurso || curso_id)
    .then((curso) => {
      setCurso(curso);
    })
    .catch((err) => setError(err.message));
  // console.log(params?.idCurso)
  }

  function getInscripcionesByUser(user_id) {
    inscripcionesService
    .findByUser(user_id)
    .then((inscripciones) => {
      setInscripciones(inscripciones);
      // if(inscripciones.length > 0) {
        console.log(verifyInscripto('63743748932195c12d9856f0'));

      // }
      // verifyInscripto(inscripciones);
    })
    .then((res) => {

    }
    )
    .catch((err) => setError(err.message));
  }

  function handleSelectedTurno(turno) {
    setSelectedTurno(turno);
    console.log(selectedTurno);
  }

  function handleMouseOver(id) {
    setHoveredTurno(id);
  }

  function handleMouseLeave() {
    setHoveredTurno('');
  }

  function verifyInscripto(turno_id) {
    console.log(inscripciones)
    return inscripciones.map(inscripcion =>
      // {
      // console.log(inscripcioness)
      Object.values(inscripcion).some((arrVal) => turno_id === arrVal)
    // }
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
                            horInicio={turno.horarioInicio}
                            horFin={turno.horarioFin}
                            color={turno.color}
                            selectedTurno={selectedTurno}
                            handleSelectedTurno={handleSelectedTurno}
                            handleMouseOver={handleMouseOver}
                            handleMouseLeave={handleMouseLeave}
                            hoveredTurno={hoveredTurno}
                            handleShow={handleShow}
                            verifyInscripto={verifyInscripto}
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
        </Modal.Header>
        <Modal.Body>
          <p><span className="negritas">Detalle del curso:</span> {curso.descripcion}</p>
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
        <Button className="btn-close-link" variant="link" onClick={handleClose}>
            Cerrar
          </Button>
          {verifyInscripto(selectedTurno._id).some(val => val) ? 
          //  <div className="btn-group dropup" role="group">
          //  <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          //    Dropdown
          //  </button>
          //  <ul className="dropdown-menu">
          //    <li>
            <Link
            to={"/id-" + selectedTurno._id + "/curso/id-" + curso._id}
            className="btn-close-link btn-inscripto">
              
            </Link>
        //     </li>
        //      {/* <li><a className="dropdown-item" href="#">Dropdown link</a></li> */}
        //    </ul>
        //  </div>
          : 
            <Link
            to={"/id-" + selectedTurno._id + "/curso/id-" + curso._id}
            className="btn btn-primary"
            >
            Inscribirse en este horario
          </Link>
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
