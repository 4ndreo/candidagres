import "./VerTurnos.css";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import * as turnosService from "../../services/turnos.service";
import * as cursosService from "../../services/cursos.service";
import Loader from "../basics/Loader";
import TarjetaTurno from "../tarjeta-turno/TarjetaTurno";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export function VerTurnos() {
  let navigate = useNavigate();

  const [turnos, setTurnos] = useState([]);
  const [curso, setCurso] = useState();
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
    turnosService.find().then((data) => {
      setTurnos(
        data?.sort(function (a, b) {
          return a.horarioInicio - b.horarioInicio;
        })
      );
      getCurso();
    });
  }, []);

  function getCurso(curso_id) {
    cursosService
    .findById(params?.idCurso || curso_id)
    .then((curso) => {
      setCurso(curso);
    })
    .catch((err) => setError(err.message));
  // console.log(params?.idCurso)
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
              <span>{daysCount > 1 ? ', ' : ''} {diasSemana.find(o => o.id === dia).nombre}</span>
              
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
          <Link
          to={"/id-" + selectedTurno + "/curso/id-" + curso._id}
          className="btn btn-primary"
        >
          Inscribirse en este horario
        </Link>
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
