import "./css/Inscripciones.css";

import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as inscripcionesService from "../../services/inscripciones.service";
import * as turnosService from "../../services/turnos.service";
import * as cursosService from "../../services/cursos.service";
import Loader from "../../components/basics/Loader";
import { AuthContext } from "../../App";

export default function Inscripciones() {
  const [inscripciones, setInscripciones] = useState([]);
  const [turnos, setTurnos] = useState([]);
  // const [cursos, setCursos] = useState([]);

  const value = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
  }, []);
  
  useEffect(() => {
    inscripcionesService.find().then((data) => {
      setInscripciones(data);
      console.log(data);
      turnosService.find().then((data) => {
        setTurnos(data);
        console.log(data);
      });
    });
  }, []);
  
  useEffect(() => {
  }, []);

  function handleDeleteElement(item) {
    inscripcionesService.remove(item._id).then((inscripciones) => {
      console.log(inscripciones);
      setInscripciones(inscripciones);
    });
  }

  // function handleTurno(data) {
  //   // console.log(data.idTurno)
  //   // console.log(data)
  //   const result = turnos.filter((turno) => turno._id === data.idTurno);
  //   console.log(result[0].dia);
  //   return result[0].dia;
  //   // console.log(diaTurno);
  //   // return "lunes"
  // }

  if (inscripciones.length > 0 && turnos.length > 0) {
    return (
      <main className="container main">
        <div className="cont-admin-inscripciones">
          <h1>Administrar Inscripciones</h1>
          <a
            href={"inscripciones/inscripcion"}
            className="btn btn-primary mt-3"
          >
            Crear una inscripcion
          </a>
          <ul>
            {inscripciones.map((inscripcion) => {
              // return <p>{turno.horario}</p>
              return (
                <li key={inscripcion._id}>
                  <p>Alumno: {inscripcion.nombre}</p>
                  {/* <p>Dia: {handleTurno(inscripcion)}</p> */}
                  {/* <p>Dia: {inscripcion.dia}</p> */}
                  <p>
                    Monto: ${inscripcion.monto} / Metodo de Pago:{" "}
                    {inscripcion.formaPago}
                  </p>
                  <Link
                    to={"inscripcion/id-" + inscripcion._id}
                    className="btn btn-warning btn-sm rounded-2 me-2"
                  >
                    Editar inscripcion
                  </Link>
                  <button
                    onClick={() => handleDeleteElement(inscripcion)}
                    className="btn btn-danger btn-sm rounded-2"
                    type="button"
                    data-toggle="tooltip"
                    data-placement="top"
                    title=""
                    data-original-title="Delete"
                  >
                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                    Eliminar inscripcion
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    );
  }
  else 
  {
    return (
      <main className="container main">
        <Loader></Loader>
      </main>
    )
  }
}
