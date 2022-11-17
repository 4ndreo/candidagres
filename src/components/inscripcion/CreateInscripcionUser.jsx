import React, { useContext, useEffect, useState } from "react";
import * as turnosService from "../../services/turnos.service";
import * as inscripcionesService from "../../services/inscripciones.service";
import * as cursosService from "../../services/cursos.service";

import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../App";
import Loader from "../basics/Loader";

export function CreateInscripcionUser({ title }) {
  let navigate = useNavigate();
  const params = useParams();
  const value = useContext(AuthContext);

  const [nombre, setNombre] = useState("");
  const [dia, setDia] = useState("");
  const [horario, setHorario] = useState("");
  const [formaPago, setFormaPago] = useState("");
  const [nombreTaller, setNombreTaller] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState();
  const [cursoObtenido, setCursoObtenido] = useState([]);
  const [turnoObtenido, setTurnoObtenido] = useState([]);
  const [idTurno, setIdTurno] = useState("");
  const [idUser, setIdUser] = useState("");
  const [idCurso, setIdCurso] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // value.setCurrentUser(JSON.parse(localStorage.getItem("user")));
    if (!value.token) {
      navigate("/login", { replace: true });
    }
  }, []);

  // useEffect(() => {
  //     setIdCurso(params?.idCurso)
  //     console.log(params?.idCurso)
  //    const data = JSON.parse(window.localStorage.getItem('user'));

  //     console.log(data._id)
  //     console.log(data.email)
  //     setNombre(data.email)
  //     setIdUser(data._id)

  //     setFormaPago('error')

  //     // data.map((user) => {
  //     //     setNombreUser(user.email)
  //     // })
  //     // console.log(nombreUser)

  //   cursosService.findById(params?.idCurso)
  //        .then((curso) =>{
  //            setCurso(curso)
  //            setNombreTaller(curso.nombre)
  //            setDescripcion(curso.descripcion)
  //            setMonto(curso.precio)

  //            console.log(curso.deleted)
  //            console.log(curso)

  //        })
  // }, []);

  // useEffect(() => {
  //     setIdTurno(params?.idTurnos)

  //    turnosService.findById(params?.idTurnos)
  //        .then((turno) =>{
  //            setTurno(turno)
  //            setDia(turno.dia)
  //            setHorario(turno.horario)
  //            console.log(turno)
  //        })
  // }, []);

  const fn = async () => {
    const delay = (timeout, promise) => {
      setTimeout(() => promise, timeout);
    };

    delay(
      200,
      cursosService.findById(params?.idCurso).then((curso) => {
        setIdCurso(params?.idCurso);
        setCursoObtenido(curso);
        setNombreTaller(curso.nombre);
        setDescripcion(curso.descripcion);
        setMonto(curso.precio);
        turnosService.findById(params?.idTurnos).then((turno) => {
          setTurnoObtenido(turno);
          setIdTurno(params?.idTurnos);
          setDia(turno.dia);
          setHorario(turno.horario);
        });
      })
    );
    // turnosService.findById(params?.idTurnos).then((turno) => {
    //   setTurnoObtenido(turno);
    //   setIdTurno(params?.idTurnos);
    //   setDia(turno.dia);
    //   setHorario(turno.horario);
    // });
    // cursosService.findById(params?.idCurso).then((curso) => {
    //   setIdCurso(params?.idCurso);
    //   setCursoObtenido(curso);
    //   setNombreTaller(curso.nombre);
    //   setDescripcion(curso.descripcion);
    //   setMonto(curso.precio);
    // });

    setNombre(value.currentUser.email);
    setIdUser(value.currentUser._id);
    setFormaPago("error");
  };
  useEffect(() => {
    fn();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    if (formaPago !== "error") {
      inscripcionesService
        .create({ nombre, monto, formaPago, idTurno, idUser, idCurso })
        .then((data) => {
          navigate("/perfil", { replace: true });
        })
        .catch((err) => setError(err.message));
      // console.log(formaPago)
    } else {
      window.alert("Tenes que seleccionar una forma de pago");
    }
  }

  if (cursoObtenido.deleted === false || null) {
    return (
      <main className="container edit-cont">
        <h1>{title} Online</h1>
        <div className="card w-100 mt-5">
          <div className="card-header">
            <h2 className="mb-0">{nombreTaller}</h2>
          </div>
          <ul>
            <li>Nombre del Taller: {nombreTaller}</li>
            <li>Descripcion: {descripcion}</li>
            <li>Precio: ${monto}</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div>
            <label htmlFor="cursos">Método de pago</label>
            <select
              name="cursos"
              id="cursos"
              form="cursosForm"
              onChange={(e) => setFormaPago(e.target.value)}
              required
            >
              <option value="error"> Selecciona el método de pago...</option>
              <option value="transferencia"> Transferencia </option>
              <option value="efectivo"> Efectivo</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary mt-5">
            Inscribirse
          </button>
        </form>
      </main>
    );
  } else {
    return (
      <main className="container main">
        <Loader></Loader>
      </main>
    );
  }
}
